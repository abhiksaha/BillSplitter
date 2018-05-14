import { BillSplitterWebPage } from './app.po';

describe('bill-splitter-web App', () => {
  let page: BillSplitterWebPage;

  beforeEach(() => {
    page = new BillSplitterWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
