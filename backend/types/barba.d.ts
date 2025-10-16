declare module '@barba/core' {
  interface BarbaData {
    current: {
      container: HTMLElement;
      namespace?: string;
      url: {
        hash: string;
        href: string;
        path: string;
        port: string | null;
        query: Record<string, string>;
      };
    };
    next: {
      container: HTMLElement;
      namespace?: string;
      url: {
        hash: string;
        href: string;
        path: string;
        port: string | null;
        query: Record<string, string>;
      };
    };
    trigger?: 'back' | 'forward' | string;
  }

  interface BarbaHooks {
    before: (data: BarbaData) => void;
    beforeLeave: (data: BarbaData) => void;
    leave: (data: BarbaData) => void;
    afterLeave: (data: BarbaData) => void;
    beforeEnter: (data: BarbaData) => void;
    enter: (data: BarbaData) => void;
    afterEnter: (data: BarbaData) => void;
    after: (data: BarbaData) => void;
  }

  interface BarbaTransition {
    name: string;
    from?: { namespace: string | string[] };
    to?: { namespace: string | string[] };
    sync?: boolean;
    beforeLeave?: (data: BarbaData) => void | Promise<void>;
    leave?: (data: BarbaData) => void | Promise<void>;
    afterLeave?: (data: BarbaData) => void | Promise<void>;
    beforeEnter?: (data: BarbaData) => void | Promise<void>;
    enter?: (data: BarbaData) => void | Promise<void>;
    afterEnter?: (data: BarbaData) => void | Promise<void>;
  }

  interface BarbaView {
    namespace: string;
    beforeEnter?: (data: BarbaData) => void;
    afterEnter?: (data: BarbaData) => void;
    beforeLeave?: (data: BarbaData) => void;
    afterLeave?: (data: BarbaData) => void;
  }

  interface BarbaOptions {
    debug?: boolean;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    prefetchIgnore?: boolean | ((href: string) => boolean);
    preventRunning?: boolean;
    transitions?: BarbaTransition[];
    views?: BarbaView[];
    timeout?: number;
    prevent?: (props: { el: HTMLElement; event: Event; href: string }) => boolean;
    schema?: any;
    cacheIgnore?: boolean | string[] | RegExp | ((href: string) => boolean);
  }

  interface BarbaHooksInstance {
    before: (handler: (data: BarbaData) => void) => void;
    beforeLeave: (handler: (data: BarbaData) => void) => void;
    leave: (handler: (data: BarbaData) => void) => void;
    afterLeave: (handler: (data: BarbaData) => void) => void;
    beforeEnter: (handler: (data: BarbaData) => void) => void;
    enter: (handler: (data: BarbaData) => void) => void;
    afterEnter: (handler: (data: BarbaData) => void) => void;
    after: (handler: (data: BarbaData) => void) => void;
  }

  interface Barba {
    init: (options: BarbaOptions) => void;
    destroy: () => void;
    hooks: BarbaHooksInstance;
    go: (href: string, options?: { trigger?: string }) => void;
    prefetch: (href: string) => void;
    getTransition: () => BarbaTransition;
  }

  const barba: Barba;
  export default barba;
} 