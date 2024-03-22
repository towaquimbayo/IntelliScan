import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import RootReducer from "./reducers/RootReducer";

const persistConfig = {
  key: "intelliscan", // The key to use for local storage
  storage,
};

const store = createStore(
  persistReducer(persistConfig, RootReducer),
  applyMiddleware(thunk)
);
const persistor = persistStore(store);

export { store, persistor };
