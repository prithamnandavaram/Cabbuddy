import { Github, Linkedin, Mail } from "lucide-react"

const Developer = () => {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-6xl font-bold text-white">
              PN
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-primary mb-2">About the Developer</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">Pritham Nandavaram</h3>
            
            <p className="text-muted-foreground mb-4">
              Computer Science Engineering student at BMS Institute of Technology and Management, Bangalore. 
              Passionate about full-stack development with expertise in MERN stack, Python, and modern web technologies. 
              Skilled in building scalable applications and solving complex problems.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-4">
              <a 
                href="mailto:prithamnandavaram@gmail.com" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">prithamnandavaram@gmail.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <a
                href="https://github.com/prithamnandavaram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/prithamnandavaram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Developer
