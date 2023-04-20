import mapValues from './mapValues';

type FieldNames = Record<string, string>;
type SymbolicFieldNames<T> = {
  [P in Exclude<keyof T, symbol>]: `_${P} (unique symbol)`;
};

function makeSymbolicFields<T extends FieldNames>(newFields: T): SymbolicFieldNames<T>;
function makeSymbolicFields<T extends FieldNames, E extends FieldNames>(newFields: T, extendsFields: E): E & SymbolicFieldNames<T>;
function makeSymbolicFields<T extends FieldNames, E extends FieldNames>(newFields: T, extendsFields?: E) {
  return {
    ...(extendsFields ?? ({} as E)),
    ...mapValues(newFields, (value) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Symbol(value) as any;
    }),
  };
}

export default makeSymbolicFields;
