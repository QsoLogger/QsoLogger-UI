// typings.d.ts
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
  declare module '*.less';
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module 'next-with-less';
