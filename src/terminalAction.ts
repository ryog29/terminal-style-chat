export const SET_TEXT = 'set_text' as const;
export const MKDIR = 'mkdir' as const;
export const PWD = 'pwd' as const;
export const LS = 'ls' as const;
export const TOUCH = 'touch' as const;
export const CD = 'cd' as const;
export const RM = 'rm' as const;

export const setText = (text: string) => ({
  type: SET_TEXT,
  payload: { text },
});

export const mkdir = (dirName: string) => ({
  type: MKDIR,
  payload: { dirName },
});

export const pwd = () => ({
  type: PWD,
});

export const ls = () => ({
  type: LS,
});

export const touch = (fileName: string) => ({
  type: TOUCH,
  payload: { fileName },
});

export const cd = (path: string) => ({
  type: CD,
  payload: { path },
});

export const rm = (name: string) => ({
  type: RM,
  payload: { name },
});

export type TerminalActionTypes =
  | ReturnType<typeof setText>
  | ReturnType<typeof mkdir>
  | ReturnType<typeof pwd>
  | ReturnType<typeof ls>
  | ReturnType<typeof touch>
  | ReturnType<typeof cd>
  | ReturnType<typeof rm>;
