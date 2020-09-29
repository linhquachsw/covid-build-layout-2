export const assignId = (routes) => {
  return routes.map((route, idx) => {
    route.id = idx + 1;
    if (route.children) {
      route.children.map((child, i) => {
        child.id = route.id * 10 + (i + 1);
        child.parentId = route.id;
        return child;
      });
    }
    return route;
  });
};
