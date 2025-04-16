declare module '@barba/core' {
  namespace barba {
    function init(options: any): void;
  }
  export default barba;
}

declare module 'animejs' {
  const anime: any;
  export default anime;
} 