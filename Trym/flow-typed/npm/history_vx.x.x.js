// https://github.com/ReactTraining/history

declare type JSONLike =
  | void
  | string
  | boolean
  | number
  | { [key: string]: JSONLike }
  | Array<JSONLike>;
declare type Action = "PUSH" | "REPLACE" | "POP";
declare type History = {
  length: number,
  location: Location,
  action: ?Action,
  listenBefore(hook: TransitionHook): HistoryListenerRef,
  listen(listener: LocationListener): HistoryListenerRef,
  push(location: LocationDescriptor): void,
  replace(location: LocationDescriptor): void,
  go(n: number): void,
  goBack(): void,
  goForward(): void,
  createKey(): LocationKey,
  createPath(location: LocationDescriptor): Path,
  createHref(location: LocationDescriptor): Href,
  createLocation(
    location: LocationDescriptor,
    action: ?Action,
    key: ?LocationKey
  ): Location
};
declare type BrowserHistory = History;
declare type HashHistory = History;
declare type MemoryHistory = History & {
  index: number,
  entries: any[],
  canGo(n: number): boolean
}
declare type HistoryListenerRef = () => void;
declare type HistoryOptions = Object;
declare type Href = string;
declare type Location = {
  pathname: Pathname,
  search: Search,
  query: Query,
  state: LocationState,
  action: Action,
  key: LocationKey
};
declare type LocationDescriptorObject = {
  pathname: Pathname,
  search: Search,
  query: Query,
  state: LocationState
};
declare type LocationDescriptor = LocationDescriptorObject | Path;
declare type LocationKey = string;
declare type LocationListener = (location: Location) => void;
declare type LocationState = ?JSONLike;
declare type Path = string;
declare type Pathname = string;
declare type Query = Object;
declare type Search = string;
declare type TransitionHook = (
  location: Location,
  callback: ?(result: any) => void
) => any;

declare module "history/createBrowserHistory" {
  declare export default function createBrowserHistory(): BrowserHistory;
}

declare module "history/createHashHistory" {
  declare export default function createHashHistory(): HashHistory;
}

declare module "history/createMemoryHistory" {
  declare export default function createMemoryHistory(): MemoryHistory;
}
