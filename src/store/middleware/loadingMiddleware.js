import { setLoading } from "../slices/loadingSlice";

const loadingMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // RTK Query action'larını kontrol et
  if (action.type?.endsWith("/pending")) {
    store.dispatch(setLoading(true));
  } else if (
    action.type?.endsWith("/fulfilled") ||
    action.type?.endsWith("/rejected")
  ) {
    setTimeout(() => {
      const state = store.getState();
      const apiState = state.api;

      let hasPendingRequest = false;
      if (apiState) {
        if (apiState.queries) {
          for (const key in apiState.queries) {
            if (apiState.queries[key]?.status === "pending") {
              hasPendingRequest = true;
              break;
            }
          }
        }
        if (apiState.mutations) {
          for (const key in apiState.mutations) {
            if (apiState.mutations[key]?.status === "pending") {
              hasPendingRequest = true;
              break;
            }
          }
        }
      }

      if (!hasPendingRequest) {
        store.dispatch(setLoading(false));
      }
    }, 0);
  }

  return result;
};

export default loadingMiddleware;
