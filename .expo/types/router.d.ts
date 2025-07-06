/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/detailAnalysis`; params?: Router.UnknownInputParams; } | { pathname: `/form`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/language`; params?: Router.UnknownInputParams; } | { pathname: `/onboard`; params?: Router.UnknownInputParams; } | { pathname: `/results`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/detailAnalysis`; params?: Router.UnknownOutputParams; } | { pathname: `/form`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/language`; params?: Router.UnknownOutputParams; } | { pathname: `/onboard`; params?: Router.UnknownOutputParams; } | { pathname: `/results`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/detailAnalysis${`?${string}` | `#${string}` | ''}` | `/form${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/language${`?${string}` | `#${string}` | ''}` | `/onboard${`?${string}` | `#${string}` | ''}` | `/results${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/detailAnalysis`; params?: Router.UnknownInputParams; } | { pathname: `/form`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/language`; params?: Router.UnknownInputParams; } | { pathname: `/onboard`; params?: Router.UnknownInputParams; } | { pathname: `/results`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
