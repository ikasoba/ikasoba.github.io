import { PageInfo } from "dejamu/core/PageInfo.ts";

export function getPageDate(page: PageInfo) {
  if (page.timestamp) {
    return page.timestamp;
  } else {
    const am = page.sourcePath.match(/([0-9]{4})-([0-9]{2})\/([0-9]{2})/);

    const ad = am ? new Date(am.slice(1).join("/")) : page.timestamp;

    return ad;
  }
}

export function comparePage(a: PageInfo, b: PageInfo) {
  if (a.timestamp && b.timestamp) {
    return a.timestamp.getTime() - b.timestamp.getTime();
  } else {
    const am = a.sourcePath.match(/([0-9]{4})-([0-9]{2})\/([0-9]{2})/);
    const bm = b.sourcePath.match(/([0-9]{4})-([0-9]{2})\/([0-9]{2})/);

    const ad = am ? new Date(am.slice(1).join("/")) : a.timestamp;
    const bd = bm ? new Date(bm.slice(1).join("/")) : b.timestamp;

    return ad && bd ? ad.getTime() - bd.getTime() : -1;
  }
}

