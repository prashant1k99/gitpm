import { IPageInfo } from "./common";

export enum DataType {
  ASSIGNEES = 'ASSIGNEES',
  DATE = 'DATE',
  ITERATION = 'ITERATION',
  LABELS = 'LABELS',
  LINKED_PULL_REQUESTS = 'LINKED_PULL_REQUESTS',
  MILESTONE = 'MILESTONE',
  NUMBER = 'NUMBER',
  PARENT_ISSUE = 'PARENT_ISSUE',
  REPOSITORY = 'REPOSITORY',
  REVIEWERS = 'REVIEWERS',
  SINGLE_SELECT = 'SINGLE_SELECT',
  SUB_ISSUES_PROGRESS = 'SUB_ISSUES_PROGRESS',
  TEXT = 'TEXT',
  TITLE = 'TITLE',
  TRACKED_BY = 'TRACKED_BY',
  TRACKS = 'TRACKS'
}

export interface IProjectV2CommonField {
  id: string;
  name: string;
  dataType: DataType;
  __typename: 'ProjectV2Field' | 'ProjectV2SingleSelectField' | 'ProjectV2IterationField';
}

export interface ISelectOption {
  color: string;
  id: string;
  name: string;
  description: string;
}

export interface ISingleSelectFieldQR extends IProjectV2CommonField {
  __typename: 'ProjectV2SingleSelectField';
  options: ISelectOption[];
}

export interface IIteration {
  duration: number;
  id: string;
  startDate: string;
  title: string;
}

export interface IIterationConfig {
  duration: number;
  startDay: number;
  iterations: IIteration[];
  completedIterations: IIteration[]; // You can define a more specific type if needed
}

export interface IIterationFieldQR extends IProjectV2CommonField {
  __typename: 'ProjectV2IterationField';
  configuration: IIterationConfig;
}

export type TProjectV2Field = IProjectV2CommonField | ISingleSelectFieldQR | IIterationFieldQR;

export interface IField {
  pageInfo: IPageInfo
  totalCount: number
  fields: TProjectV2Field[]
}

export interface IFieldState {
  orgId: string | null,
  isLoadingFieldsForProject: number | null,
  loadedProjects: number[]
}

