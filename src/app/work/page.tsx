import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionContent } from "@/components/layout/SectionContent";
import { StackedSections } from "@/components/home/StackedSections";
import { getAllWorkItems } from "@/lib/api/work";
import { WorkCard } from "@/components/work/WorkCard";

export const revalidate = 86400;

export default function WorkPage() {
  const items = getAllWorkItems();

  return (
    <StackedSections>
      <Section key="work-header" id="work-header" fullHeight>
        <Container fullWidth>
          <SectionContent className="flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl">
              WORK
            </h1>
            <p className="mt-6 text-xl text-muted-foreground sm:text-2xl max-w-2xl">
              Projects I&apos;ve built and experiences that shaped my journey
            </p>
          </SectionContent>
        </Container>
      </Section>

      {items.map((item) => (
        <Section key={item.id} id={item.id} fullHeight>
          <Container fullWidth>
            <SectionContent className="flex flex-col items-center justify-center">
              <WorkCard item={item} />
            </SectionContent>
          </Container>
        </Section>
      ))}
    </StackedSections>
  );
}
