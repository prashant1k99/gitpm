import { IPageInfo } from "@/types/common";

export enum ItemType {
  DRAFT_ISSUE = "DRAFT_ISSUE",
  ISSUE = "ISSUE",
  PULL_REQUEST = "PULL_REQUEST",
  REDACTED = "REDACTED"
}

export interface I_ItemInfo {
  id: string,
  isArchived: boolean,
  updatedAt: string,
  type: ItemType,
  fieldValues: {
    totalCount: number;
    pageInfo: IPageInfo;
    nodes: ProjectV2ItemFieldValue[];
  };
  content: ItemContent;
}

export interface ProjectV2FieldCommon {
  id: string;
  name: string;
}

export interface LabelNode {
  id: string;
  name: string;
  color: string;
}

export interface MilestoneNode {
  id: string;
  title: string;
  state: string;
}

export interface PullRequestNode {
  id: string;
  closed: boolean;
  title: string;
}

export interface RepositoryNode {
  name: string;
  id: string;
}

export interface UserNode {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ReviewerBot {
  __typename: "Bot";
  id: string;
  login: string;
  avatarUrl: string;
}

export interface ReviewerMannequin {
  __typename: "Mannequin";
  id: string;
  login: string;
  avatarUrl: string;
}

export interface ReviewerTeam {
  __typename: "Team";
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ReviewerUser {
  __typename: "User";
  id: string;
  name: string;
  avatarUrl: string;
}

export type ReviewerNode = ReviewerBot | ReviewerMannequin | ReviewerTeam | ReviewerUser;

// Field value types
export interface ProjectV2ItemFieldValueCommon {
  id: string;
  field: ProjectV2FieldCommon;
}

export interface ProjectV2ItemFieldDateValue extends ProjectV2ItemFieldValueCommon {
  date: string;
}

export interface ProjectV2ItemFieldIterationValue extends ProjectV2ItemFieldValueCommon {
  iterationId: string;
}

export interface ProjectV2ItemFieldLabelValue extends ProjectV2ItemFieldValueCommon {
  labels: {
    totalCount: number;
    pageInfo: IPageInfo;
    nodes: LabelNode[];
  };
}

export interface ProjectV2ItemFieldMilestoneValue extends ProjectV2ItemFieldValueCommon {
  milestone: MilestoneNode;
}

export interface ProjectV2ItemFieldPullRequestValue extends ProjectV2ItemFieldValueCommon {
  pullRequests: {
    nodes: PullRequestNode[];
  };
}

export interface ProjectV2ItemFieldRepositoryValue extends ProjectV2ItemFieldValueCommon {
  repository: RepositoryNode;
}

export interface ProjectV2ItemFieldReviewerValue extends ProjectV2ItemFieldValueCommon {
  reviewers: {
    pageInfo: IPageInfo;
    totalCount: number;
    nodes: ReviewerNode[];
  };
}

export interface ProjectV2ItemFieldSingleSelectValue extends ProjectV2ItemFieldValueCommon {
  color: string;
  id: string;
  name: string;
}

export interface ProjectV2ItemFieldTextValue extends ProjectV2ItemFieldValueCommon {
  id: string;
  text: string;
}

export interface ProjectV2ItemFieldUserValue extends ProjectV2ItemFieldValueCommon {
  users: {
    totalCount: number;
    pageInfo: IPageInfo;
    nodes: UserNode[];
  };
}

export type ProjectV2ItemFieldValue =
  | ProjectV2ItemFieldDateValue
  | ProjectV2ItemFieldIterationValue
  | ProjectV2ItemFieldLabelValue
  | ProjectV2ItemFieldMilestoneValue
  | ProjectV2ItemFieldPullRequestValue
  | ProjectV2ItemFieldRepositoryValue
  | ProjectV2ItemFieldReviewerValue
  | ProjectV2ItemFieldSingleSelectValue
  | ProjectV2ItemFieldTextValue
  | ProjectV2ItemFieldUserValue;

// Content types
export interface IssueContent {
  number: number;
  id: string;
  title: string;
  state: string;
  body: string;
  closed: boolean;
  createdAt: string;
  milestone: MilestoneNode | null;
  assignees: {
    nodes: UserNode[];
  };
  author: {
    avatarUrl: string;
    login: string;
  };
  authorAssociation: string;
  linkedBranches: {
    nodes: {
      id: string;
      ref: {
        id: string;
        name: string;
        prefix: string;
      };
    }[];
  };
  parent: { id: string } | null;
  reactions: {
    nodes: {
      id: string;
      content: string;
      user: {
        id: string;
        name: string;
        login: string;
        avatarUrl: string;
      };
    }[];
  };
  viewerCanClose: boolean;
  viewerCanDelete: boolean;
  viewerCanLabel: boolean;
  viewerCanReopen: boolean;
  viewerCanUpdate: boolean;
  labels: {
    totalCount: number;
    nodes: LabelNode[];
  };
  repository: RepositoryNode;
}

export interface DraftIssueContent {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  assignees: {
    nodes: UserNode[];
  };
}

export type ItemContent = IssueContent | DraftIssueContent;

export interface I_ItemState {
  orgLogin: string | null,
  isLoading: boolean,
  loadedProjects: number[],
  items: {
    [key: number]: {
      pageInfo: IPageInfo,
      totalCount: number,
      items: I_ItemInfo[]
    }
  }
}
