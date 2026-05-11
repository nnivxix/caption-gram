export type ValidationErrors = Record<string, string[]>;

export type UseSubmitOptions = {
  onSuccess?: (result: any) => any;
  onError?: (error: any) => any;
};

export function useSubmit<T>(
  fetchable: () => Promise<T>,
  options: UseSubmitOptions = {},
) {
  const validationErrors = ref<ValidationErrors>({});
  const error = ref<Error | null>(null);
  const isLoading = ref(false);
  const succeeded = ref<boolean | null>(null);

  async function submit() {
    validationErrors.value = {};
    error.value = null;
    isLoading.value = true;
    succeeded.value = null;

    try {
      const data = await fetchable();
      succeeded.value = true;
      options?.onSuccess?.(data);
      return data;
    } catch (e: any) {
      error.value = e;
      succeeded.value = false;
      options?.onError?.(e);
      validationErrors.value = e.data?.errors ?? {};

      if (e.response?.status !== 422) throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    submit,
    isLoading,
    succeeded,
    validationErrors,
    error,
  };
}
