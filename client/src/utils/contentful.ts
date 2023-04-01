const handleContentfulImage = (url?: string) => {
  if (url) {
    return url.replace('//', 'https://')
  }
  return url;
}

export {
  handleContentfulImage
}