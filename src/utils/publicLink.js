export const publicLinkUrl = (shortUrl) =>
  `${window.location.origin}/${encodeURIComponent(shortUrl)}`;

export const publicLinkLabel = (shortUrl) =>
  publicLinkUrl(shortUrl).replace(/^https?:\/\//, '');

export const publicLinkPrefix = () => `${window.location.host}/`;
