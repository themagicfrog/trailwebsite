import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '../../data/projects';
import styles from '@/styles/Project.module.css';
function generateDescriptionHTML(descriptionParts) {
  return descriptionParts.map(part => `<p>${part}</p>`).join('');
}
export default function ProjectPage({ project }) {
  const router = useRouter();
  const { slug } = router.query;
  if (!router.isFallback && !project?.name) {
    return <div>404 - Project Not Found</div>;
  }
  const description = generateDescriptionHTML(project.description);
  return (
    <div className="project-page">
      <Head>
        <title>{`${project.name} - THE TRAIL BOARD`}</title>
      </Head>
      <div className={styles.projectImages}>
        {project.images && project.images.map((image, index) => (
          <div key={index} className={styles.projectImage}>
            <Image
              src={image}
              alt={`${project.name} image ${index + 2}`}
              width={401}
              height={251}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        ))}
      </div>
      <h1>{project.name}</h1>
      <p>created by {project.author}</p>
      <div dangerouslySetInnerHTML={{ __html: description }} />
      {project.video && (
        <div className={styles.projectVideo}>
          <iframe
            width="560"
            height="315"
            src={project.video}
            title={project.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <Link href="/" passHref>
        <button className="back-button">Back to Home</button>
      </Link>
    </div>
  );
}
export async function getStaticPaths() {
  const paths = projects.map(project => ({
    params: { slug: project.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') },
  }));
  return {
    paths,
    fallback: false,
  };
}
export async function getStaticProps({ params }) {
  const { slug } = params;
  const project = projects.find(proj => proj.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === slug);
  return {
    props: {
      project,
    },
  };
}