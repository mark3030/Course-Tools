export const hadNull = (obj)=>{
  const keys = Object.keys(obj)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if(!obj[key])return true
  }
}
