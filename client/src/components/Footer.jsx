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
            <a 
              href="https://www.geeksforgeeks.org/user/prithamnandavaram" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GeeksforGeeks"
              className="hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.693 3.693 0 0 1-2.135-2.078 3.773 3.773 0 0 1-.13-.353h7.418a4.547 4.547 0 0 1-.368 1.008zm-11.97-3.59a3.82 3.82 0 0 1 1.002-1.343 4.34 4.34 0 0 1 1.32-.895 5.282 5.282 0 0 1 3.073-.33 4.24 4.24 0 0 1 1.852.9c.52.473.93 1.064 1.203 1.736.096.24.177.486.239.737H9.48zm1.86-5.883a4.5 4.5 0 0 0-1.86.384 4.276 4.276 0 0 0-1.25.879 4.172 4.172 0 0 0-.73 1.153 4.01 4.01 0 0 0-.27 1.459 3.897 3.897 0 0 0 .27 1.459 4.14 4.14 0 0 0 .73 1.152 4.256 4.256 0 0 0 1.25.879 4.5 4.5 0 0 0 1.86.384 4.5 4.5 0 0 0 1.86-.384 4.256 4.256 0 0 0 1.25-.879 4.14 4.14 0 0 0 .73-1.152 3.897 3.897 0 0 0 .27-1.459 4.01 4.01 0 0 0-.27-1.459 4.172 4.172 0 0 0-.73-1.153 4.276 4.276 0 0 0-1.25-.879 4.5 4.5 0 0 0-1.86-.384z"/>
              </svg>
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