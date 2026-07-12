export interface SiteAdapter {
  id: string;
  matches(url: URL): boolean;
  observeRoot(doc: Document): HTMLElement;
  findProductCards(root: ParentNode): HTMLElement[];
  getImage(card: HTMLElement): HTMLImageElement | null;
  getTitle(card: HTMLElement): string | null;
  getBadgeMount(card: HTMLElement): HTMLElement;
}
