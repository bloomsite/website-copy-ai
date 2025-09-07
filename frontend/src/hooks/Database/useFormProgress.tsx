import { useEffect, useCallback, useRef, useState } from "react";
import apiClient from "../../services/apiClient";
import { AxiosError } from "axios";

export interface Answers {
  [sectionIndex: number]: {
    [instanceIndex: number]: {
      [fieldIndex: number]: string;
    };
  };
}

export interface FieldValue {
  [sectionIndex: number]: {
    [instanceIndex: number]: {
      [fieldIndex: number]: string;
    };
  };
}

interface ProgressProps {
  userId: string | null;
  formId: string;
  formVersion: string;
  token: string | null;
  debounceMs?: number;
}

export function useFormProgress({
  userId,
  formId,
  formVersion,
  token,
  debounceMs,
}: ProgressProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const dirtyRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const endpoint = `api/forms/progress/`;

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
        setAnswers(data);
      } else if (response.status === 404) {
        console.log("No progress found");
        setAnswers({});
      }
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, [endpoint, token, formVersion]);

  const saveProgressNow = useCallback(
    async (payload?: Answers) => {
      try {
        setSaving(true);
        setError(null);
        const response = await apiClient.put(endpoint, {
          userId,
          formId,
          formVersion,
          answers: payload ?? answers,
        });

        const data = response.data;
        dirtyRef.current = false;
        setLastSavedAt(data?.updatedAt ?? new Date().toISOString());
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setSaving(false);
      }
    },
    [endpoint, token, userId, formId, formVersion, answers]
  );
  useEffect(() => {
    if (loading) return;
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
    fetchProgress();
  }, [fetchProgress, formVersion]);

  // Safety nets
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

  const setOneAnswer = useCallback(
    (
      sectionIdx: number,
      instanceIdx: number,
      fieldIdx: number,
      value: string
    ) => {
      setAnswers((prev) => ({
        ...prev,
        [sectionIdx]: {
          ...(prev[sectionIdx] || {}),
          [instanceIdx]: {
            ...(prev[sectionIdx]?.[instanceIdx] || {}),
            [fieldIdx]: value,
          },
        },
      }));
    },
    []
  );

  return {
    answers,
    setAnswers,
    setOneAnswer,
    loading,
    saving,
    error,
    lastSavedAt,
    saveProgressNow,
  };
}
