
function wait(tMillisec)
{
 const start = Date.now();
 while ( Date.now() - start < tMillisec ) {}
} 

/*
function useToggle (initialValue = true) {
  const [value, setValue] = useState(initialValue)
  const toggle = function () {
      setValue(v => !v)
  }
  return [value, toggle]
}

*/
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function truncateString(str, num) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + '...'
}

function shortenString(str, totalLength, leftRight) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= totalLength) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  // todo  : total length is not taken into account
  return str.slice(0, leftRight) + '....' + str.slice(str.length-leftRight, str.length)
}

export { wait, zeroPad, truncateString, shortenString };
