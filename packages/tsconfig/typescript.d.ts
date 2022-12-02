/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */

type Qualified<T> = T;

/** @see {@link https://www.typescriptlang.org/ko/play?ts=4.7.4#code/PTAEAsBdIBwZwFwgOYEtLgK4CMB0BjAewFthIBPGAUznwCdUZIBaGgG1QDtIzKb7GLdlx6o4cTDWAAmAAwA2AMwBiMRKpFixKt2byA7AFYAjIfkAWAJzSAUCAjR4SYGgw4CJYMVT1CcQgBmPAAqfADKAkzAapJwMsb6irY2FNSgAHKEnOmYbBxw4ABqAIZskqAAvKAA3gC+ANwpfKAAgpzkAPLYAFYakJWgAEoahHQAJgA8AAp0hNR0FADSVOQANKDF7QB8jalUoFNsxVxdvfiQE8GgVAAekDpjcBlZOXliRaXlVdWgANpToC4B1m8yWKwAughQJhOABrTiEADunFAtS2Ax+AHJMQB+KEw+FIlG1UAAMlAwV2zQAosQmJ0en0BodjpxTn0Jplsrl8h8ylQdjYbPgjuJQABZcgAYVFT2qNlAitAAUIhChnEwxGwVDojSVoCInDgkDomHOowAFABKGoK-VKjBiXAqwgDYzSRR6pW1Gw+mxsKj9BHct4FEr8qFc1688NfGrK1VQ92KVGNYPR96xqjO1UDTEuzFpl48zOfbMut0eoshmNl3DYYp0SuemzpkthssDGFjKgBLhUMbVjMd-kDDV5Iftvlx-Oqwut4uh6f7KrJydLrMDE2Sde10dVC0BGHnVBZa01WpW3el-egThURGgAAixXu1uvI7jdQ-y4xCbVoDJuYqYLjWN5xvej6SjKxTiO+QoBv0VB0hQ7LnFCtL0mh-TfA0NjIVhjLnF2nA9n296DvhKEMmcOF3jyjQEahRF0bOhDzkxNFMquVZUYRtFbqaVCMdR2EDIex6QKenDnnUV58cxAlVJBz6vlQ8GcWJuEifx3Hxi6SYesBeGaSxY4PhK0qyvB-qBqAhAscs5CIqMYxQg5Sn6YmgEeiBHl9E5LnjDmrpVGx87+ecgWuSFzaNJFkDRcFDZNjxLYJUlYwkWR-aURlKxBVlykMTY+XOa5eYFvFjkFRVaXVbRmWCTupU1eV4ziUenAnmeNpyQ1AW1R1ykWS+b7yWVhUYnhk11V5AFAX5bVTSNUFWbBcA2Yh9ksaE1BQlp82GSmM27XwsVhVVrW0Xt5a5vV119Ld9aNnFj3nLd2W9rlA0fc0xUTu9kCfZdc6-cD-0+elZ1pFU27CUDIOgBJ3VSb1F4TTDK53qNanwQlSPfojkM-AZUPGeDSMqdB1nybZ-SbFx6GtO0h2k95yYgYz2EXaA4WNNzLG82uNiC7RL2pVDAus2ZVTdt9FHS0zdHjmwSuHfzosy55Iti3p8Pq7LyNdT1Ml9ZehueSpY3qfJevEdpWvK3+ZOLXh9sqxZNMbVtdkwEcJwsVCLKB557MLUZIH+6yPMVqD7GNNHod9MLvFJ2yQspW96eHfL5EDonAcZ1bJU50bBs2GXnma1Xeki7XDvG5J0myRbldF4d1t4-JDd0UTvcuxzkd4QPq2WTBcF09tdAjOMULDEQ4zTCCOpgms9Fajq6LfP+x0UzYM+L2MvOa4fMVx1LB+z8fWcPWfw3QqRCsF1fR9jiV99FaAFef5VYOv3NEWv8DwmzRmbDGjRgE40fDbeCUCibwN3uTECUDqbrUno0emoBYQrAAJKcChD8f4gIUQzDmKvcgTlIQb21E2EkO9XbD0aDg8g+CT5XRYWwi+ItOGcAlm9XhX186UUEQDNWNhRHfyEswvBKJ47zkkTw2RnVm7o36hI5RY9YHyUkUTXRSC3YyNYXI6B49aaYO2oaY0mxICEKQRqTedDB4RxOo0KxkAbHsP-u4zx3DeI+O4Pwh6AS6J5x+sKLI1juDv0BiEv+CcIlGg8dE4JkTkl0QrnEkBqjwHqKyaY7Rbi0k2OmkUpJJSGFD0UPvfJaCJ6bXkkAA} */
type NonNullishValue = {};
type AnyObject = Record<PropertyKey, any>;
type PlainObject<T extends {} = { [P in PropertyKey]: unknown }> = { ''?: unknown } & T;
type EmptyObject = PlainObject<{}>;

type Property<T extends {}, P extends PropertyKey, D = undefined> = P extends keyof T ? T[P] : D;

type DeepPartial<T extends {}> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type DeepRequired<T extends {}> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type PickExisting<T extends {}, K extends keyof any> = {
  [P in K]: Property<T, P>;
};
