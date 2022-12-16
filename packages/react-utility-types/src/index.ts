/**
 * This is technically safe in React, because under the hood the {} type is passed into an intersection type.
 * @see {@link https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type UnknownProps = {};

/**
 * A specific function type would not trigger implicit any.
 * @see {@link https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52873#issuecomment-845806435} for a comparison between `Function` and more specific types.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type CallbackFunction = Function;
