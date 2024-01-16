import gitHubLogoWhite from '../assets/github-logo-white.svg';
import gitHubLogoBlack from '../assets/github-logo-black.svg';

// Load images
export function loadImages() {
  const gitHubLogo = document.querySelector('img[alt="GitHub Logo"]');
  gitHubLogo.src = gitHubLogoWhite;
}
