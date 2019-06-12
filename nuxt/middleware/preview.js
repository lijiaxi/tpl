export default function ({route, redirect, query, ...to}) {
  let { isShow } = query
  if (isShow == 1) {
    return redirect(route.fullPath)
  }
  
}