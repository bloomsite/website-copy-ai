import type { AxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import apiClient from "../../services/apiClient";

interface Answers {
  [key: string]: string;
}

interface ProgressProps {
  userId: string | null;
  formId: string;
  token: string | null;
  debounceMs?: number;
  skipFetch?: boolean;
  formVersion?: string;
}

export function useFormConfirmProgress({
  userId,
  formId,
  token,
  debounceMs,
  skipFetch = false,
  formVersion = "1",
}: ProgressProps) {
  const [answers, setAnswer] = useState<Answers>();

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const dirtyRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const endpoint = "api/forms/progress/";

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(endpoint, {
        params: {
          userId,
          formId,
          formVersion,
        },
      });

      if (response.status === 200 && response.data.answers) {
        const data = response.data.answers;
        setAnswer(data);
      } else if (response.status === 404) {
        console.log("No progress found");
        setAnswer({});
      }
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, [endpoint, userId, formId]);

  const saveProgressNow = useCallback(
    async (payload?: Answers) => {
      try {
        setSaving(true);
        setError(null);
        await apiClient.put(endpoint, {
          userId,
          formId,
          formVersion,
          answers: payload ?? answers,
        });

        dirtyRef.current = false;
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setSaving(false);
      }
    },
    [endpoint, token, userId, formId, answers]
  );

  // saving useEffect
  useEffect(() => {
    if (loading || !debounceMs) return; // Skip auto-save if debounceMs is 0
    dirtyRef.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (dirtyRef.current) saveProgressNow();
    }, debounceMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [answers, debounceMs, loading, saveProgressNow]);

  useEffect(() => {
    if (!skipFetch) {
      fetchProgress();
    }
  }, [fetchProgress, formId, skipFetch]);

  //   Safety nets
  useEffect(() => {
    const onBeforeUnload = () => {
      if (dirtyRef.current) {
        // Synchronous XHR is deprecated; rely on debounce + visibilitychange
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && dirtyRef.current) {
        // best-effort fire-and-forget save
        saveProgressNow();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [saveProgressNow]);

  const updateAnswers = useCallback((newAnswers: Partial<Answers>) => {
    setAnswer((prev) => {
      const current = prev || {};
      const filtered = Object.entries(newAnswers).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Answers
      );
      return { ...current, ...filtered };
    });
  }, []);

  const setAnswers = useCallback((newAnswers: Answers) => {
    setAnswer(newAnswers);
  }, []);

  return {
    answers,
    loading,
    saving,
    error,
    updateAnswers,
    setAnswers,
    saveProgressNow,
  };
}
