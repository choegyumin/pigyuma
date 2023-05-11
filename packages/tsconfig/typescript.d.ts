/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */

type Qualified<T> = T;

/** See {@link https://typescript-eslint.io/rules/ban-types/} */
type NonNullishValue = {};
type PlainObject<T extends {} = { [P in PropertyKey]: unknown }> = { ''?: unknown } & T;
type AnyObject = object;
type ExtendableAnyObject = Record<PropertyKey, any>;
type EmptyObject = Record<PropertyKey, never>;
type ExtendableEmptyObject = PlainObject<{}>;
type UnknownObject = Partial<Record<PropertyKey, unknown>>;

type Property<T extends {}, P extends PropertyKey, D = undefined> = P extends keyof T ? T[P] : D;

type ValueOf<T> = T[keyof T];

type NonNull<T> = Exclude<T, null>;

type NonUndefined<T> = Exclude<T, undefined>;

type DynamicRecord<T, K extends keyof any = PropertyKey> = Partial<Record<K, T>>;

type DeepPartial<T extends {}> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type DeepRequired<T extends {}> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};

type NonNullableRequired<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

type DeepNonNullableRequired<T extends {}> = {
  [P in keyof T]-?: NonNullableRequired<T[P]>;
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type NonReadonly<T> = {
  -readonly [P in keyof T]: T[P];
};

type DeepNonReadonly<T> = {
  -readonly [P in keyof T]: DeepNonReadonly<T[P]>;
};

type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

type DeepWritable<T> = {
  -readonly [P in keyof T]: DeepWritable<T[P]>;
};

type PickExisting<T extends {}, K extends keyof any> = {
  [P in K]: Property<T, P>;
};

type PickEnum<T, K extends T> = {
  [P in keyof K]: P extends K ? P : never;
};

type ArrayElements<T extends readonly any[]> = T extends readonly (infer E)[] ? E : never;

type SetValues<T extends Set> = T extends Set<infer E> ? E : never;

type WeakSetValues<T extends WeakSet> = T extends WeakSet<infer E> ? E : never;

type MapKeys<T extends Map> = T extends Map<infer E, V> ? E : never;

type MapValues<T extends Map> = T extends Map<K, infer E> ? E : never;

type WeakMapKeys<T extends WeakMap> = T extends WeakMap<infer E, V> ? E : never;

type WeakMapValues<T extends WeakMap> = T extends WeakMap<K, infer E> ? E : never;

type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;

type PromiseReject = (reason?: any) => void;
