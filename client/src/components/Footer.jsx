import { Github, Linkedin, Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-muted-foreground px-6 pt-16 mx-auto md:px-24 lg:px-40">
      <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <h1 className="text-xl font-bold text-primary">
            CabBuddy
          </h1>
          <div className="mt-6 lg:max-w-sm">
            <p className="text-sm text-foreground">
              Share your ride with the person heading to the same destination. Experience convenience, reliability, and affordability in one seamless package. Your journey, our priority.
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-base font-bold tracking-wide text-foreground">Contacts</p>
          <div className="flex">
            <p className="mr-1 text-foreground">Phone:</p>
            <a
              href="tel:850-123-5021"
              aria-label="Our phone"
              title="Our phone"
            >
              850-123-5021
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 text-foreground">Email:</p>
            <a
              href="mailto:prithamnandavaram@gmail.com"
              aria-label="Our email"
              title="Our email"
            >
              prithamnandavaram@gmail.com
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 text-foreground">Address:</p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Our address"
              title="Our address"
            >
              India
            </a>
          </div>
        </div>
        <div>
          <span className="text-base font-bold text-foreground">Social</span>
          <div className="flex items-center mt-2 space-x-3">
            <a 
              href="https://github.com/prithamnandavaram" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://linkedin.com/in/prithamnandavaram" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://leetcode.com/u/prithamnandavaram" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LeetCode"
            >
              <Code2 className="w-5 h-5 hover:text-primary transition-colors" />
            </a>
          </div>
          <p className="mt-4 text-sm">Connect with us</p>
        </div>
      </div>
      <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
        <p className="text-sm">&copy; Copyright 2024 CabBuddy.com | All rights reserved.</p>
        <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
          <li><a href="/" className="text-sm">F.A.Q</a></li>
          <li><a href="/" className="text-sm">Privacy Policy</a></li>
          <li><a href="/" className="text-sm">Terms &amp; Conditions</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer