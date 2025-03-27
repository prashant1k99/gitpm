export interface IPageInfo {
  hasNextPage: boolean,
  endCursor: string, // Last record id, need to be passed as after field for getting remaining records
  hasPreviousPage: boolean,
  startCursor: string, // First record id, need to be passed as before field when paginating backward
}

export enum IViewLayout {
  TABLE_LAYOUT = "TABLE_LAYOUT",
  // ROADMAP_LAYOUT = "ROADMAP_LAYOUT",
  BOARD_LAYOUT = "BOARD_LAYOUT"
}

