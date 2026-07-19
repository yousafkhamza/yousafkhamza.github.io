interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

const PageHero = ({ eyebrow, title, description }: PageHeroProps) => (
  <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-16 pb-12 md:pt-24 md:pb-16">
    <span className="eyebrow">{eyebrow}</span>
    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-5 max-w-3xl">
      {title}
    </h1>
    <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
  </div>
);

export default PageHero;
