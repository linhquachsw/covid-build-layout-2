export class DateUtilities {
  static compareDate(a, b) {
    const date1 = new Date(a).getTime();
    const date2 = new Date(b).getTime();
    // eslint-disable-next-line no-nested-ternary
    return date2 > date1 ? 1 : date2 === date1 ? 0 : -1;
  }
}
