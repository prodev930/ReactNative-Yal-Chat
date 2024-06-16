export interface Contact {
  thumbnailPath?: string;
  displayName?: string;
  phoneNumbers?: {number: string}[];
  givenName?: string;
  familyName?: string;
}
