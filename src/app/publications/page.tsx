import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicationWall } from "@/components/publications/publication-wall";
export default function PublicationsPage() { return <><SiteHeader /><main className="wall-page shell"><header className="wall-head"><span className="eyebrow">Научная стена / Beta</span><h1 className="display">Рабочие<br /><em>публикации</em></h1><p>Пространство для гипотез, заметок, критики и новых методов. Публикации прототипа являются демонстрационными.</p></header><PublicationWall /></main><SiteFooter /></>; }
