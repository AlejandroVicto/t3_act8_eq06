const INSECT_ORDERS = [
  { id: 47208, name: 'Coleoptera' },
  { id: 47157, name: 'Lepidoptera' },
  { id: 47201, name: 'Hymenoptera' },
  { id: 47792, name: 'Odonata' },
  { id: 48112, name: 'Mantodea' },
  { id: 47119, name: 'Arachnida' },
];

export const TAXON_COLORS = {
  Coleoptera: 'text-lime-400 outline-lime-500/30',
  Lepidoptera: 'text-orange-400 outline-orange-500/30',
  Hymenoptera: 'text-amber-400 outline-amber-500/30',
  Odonata: 'text-teal-400 outline-teal-500/30',
  Mantodea: 'text-pink-400 outline-pink-500/30',
  Arachnida: 'text-red-400 outline-red-500/30',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80';

export const getAll = async () => {
  const requests = INSECT_ORDERS.map(async (order) => {
    const res = await fetch(
      `https://api.inaturalist.org/v1/observations?taxon_id=${order.id}&quality_grade=research&photos=true&per_page=12&locale=es`
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.results || []).map((obs) => {
      const commonName =
        obs.taxon?.preferred_common_name ||
        obs.taxon?.name ||
        'Especie en estudio';
      const scientificName = obs.taxon?.name || 'Insecta sp.';
      const upvotes = (obs.identifications_count || 1) * 120;

      return {
        id: obs.id,
        commonName,
        title: commonName,
        scientificName,
        scientific: `(${scientificName})`,
        category: order.name,
        taxon: order.name,
        taxonColor: TAXON_COLORS[order.name] || 'text-lime-400 outline-lime-500/30',
        location: obs.place_guess || 'Reserva Natural, MX',
        author: obs.user?.name || obs.user?.login || 'Investigador',
        handle: `@${obs.user?.login || 'bio_user'}`,
        timeAgo: obs.observed_on || 'Reciente',
        time: obs.observed_on || 'Reciente',
        description:
          obs.description ||
          `Avistamiento fotográfico validado por la comunidad taxonómica en ${
            obs.place_guess || 'hábitat natural'
          }.`,
        image: obs.photos?.[0]?.url?.replace('square', 'medium') || FALLBACK_IMAGE,
        likes: `${upvotes > 999 ? (upvotes / 1000).toFixed(1) + 'K' : upvotes}`,
      };
    });
  });

  const results = await Promise.all(requests);
  const combined = results.flat();
  if (!combined.length) {
    throw new Error('No se pudieron obtener especímenes de iNaturalist.');
  }
  return combined;
};

export const create = async (item) => {
  const res = await fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: item.commonName,
      description: item.description,
      category: item.category,
    }),
  });
  if (!res.ok) throw new Error('Error al registrar espécimen en DummyJSON.');

  const category = item.category || 'Coleoptera';
  const commonName = item.commonName || 'Nuevo Espécimen';
  const scientificName = item.scientificName || 'Insecta sp.';

  return {
    id: Date.now(),
    commonName,
    title: commonName,
    scientificName,
    scientific: `(${scientificName})`,
    category,
    taxon: category,
    taxonColor: TAXON_COLORS[category] || 'text-lime-400 outline-lime-500/30',
    location: item.location || 'Reserva Natural, MX',
    author: 'Investigador',
    handle: '@bio_user',
    timeAgo: 'Recién creado',
    time: 'Recién creado',
    description: item.description || 'Avistamiento fotográfico registrado.',
    image: item.image || FALLBACK_IMAGE,
    likes: '120',
  };
};

export const update = async (id, item) => {
  const targetId = (Math.abs(Number(id)) % 30) + 1 || 1;
  const res = await fetch(`https://dummyjson.com/products/${targetId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: item.commonName,
      description: item.description,
      category: item.category,
    }),
  });
  if (!res.ok) throw new Error('Error al actualizar espécimen en DummyJSON.');

  const category = item.category || 'Coleoptera';
  const commonName = item.commonName || 'Espécimen';
  const scientificName = item.scientificName || 'Insecta sp.';

  return {
    ...item,
    id,
    commonName,
    title: commonName,
    scientificName,
    scientific: `(${scientificName})`,
    category,
    taxon: category,
    taxonColor: TAXON_COLORS[category] || 'text-lime-400 outline-lime-500/30',
  };
};

export const remove = async (id) => {
  const targetId = (Math.abs(Number(id)) % 30) + 1 || 1;
  const res = await fetch(`https://dummyjson.com/products/${targetId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar espécimen en DummyJSON.');
  return await res.json();
};

export default { getAll, create, update, remove };
