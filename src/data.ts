export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isNew?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  isPaused?: boolean;
}

export const sizes: MenuItem[] = [
  { id: 's300', name: 'Copo 300ml', price: 13.00 },
  { id: 's500', name: 'Copo 500ml', price: 18.00 },
  { id: 's700', name: 'Copo 700ml', price: 22.00 },
];

export const styles: MenuItem[] = [
  { id: 'trad', name: 'Açaí Tradicional', price: 0 },
  { id: 'casa', name: 'Casadinho (Açaí + Iogurte Grego)', price: 0 },
];

export const fruits: MenuItem[] = [
  { id: 'f_ban', name: 'Banana', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=150&q=80' },
  { id: 'f_mor', name: 'Morango', price: 4.50, isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=150&q=80' },
  { id: 'f_kiw', name: 'Kiwi', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1585059895124-747babf07a82?auto=format&fit=crop&w=150&q=80' },
  { id: 'f_uva', name: 'Uva', price: 2.70, imageUrl: 'https://images.unsplash.com/photo-1537084642907-629340c7e59c?auto=format&fit=crop&w=150&q=80' },
  { id: 'f_aba', name: 'Abacaxi', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=150&q=80' },
];

export const complementos: MenuItem[] = [
  { id: 'c_gra', name: 'Granola', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9ecdf913a8e?auto=format&fit=crop&w=150&q=80' },
  { id: 'c_suc', name: 'Sucrilhos', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=150&q=80' },
  { id: 'c_ame', name: 'Amendoim', price: 2.20, imageUrl: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=150&q=80' },
  { id: 'c_pac', name: 'Paçoca', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=150&q=80' },
  { id: 'c_lei', name: 'Leite em pó', price: 3.20, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80' },
  { id: 'c_lco', name: 'Leite condensado', price: 3.20, imageUrl: 'https://images.unsplash.com/photo-1563824443-1b85566c7f54?auto=format&fit=crop&w=150&q=80' },
];

export const doces: MenuItem[] = [
  { id: 'd_bis', name: 'Bis', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1582208945643-411d825bab77?auto=format&fit=crop&w=150&q=80' },
  { id: 'd_cho', name: 'Chocoball', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=150&q=80' },
  { id: 'd_bri', name: 'Brigadeiro', price: 3.75, imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=150&q=80' },
  { id: 'd_son', name: 'Sonho de Valsa', price: 4.25, imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92ca813bec?auto=format&fit=crop&w=150&q=80' },
  { id: 'd_our', name: 'Ouro Branco', price: 4.25, imageUrl: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b057?auto=format&fit=crop&w=150&q=80' },
  { id: 'd_kit', name: 'KitKat', price: 4.50, isNew: true, imageUrl: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=150&q=80' },
  { id: 'd_got', name: 'Gotas de chocolate', price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=150&q=80' },
];

export const mousses: MenuItem[] = [
  { id: 'm_mor', name: 'Mousse de Morango', price: 5.50, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80' },
  { id: 'm_mar', name: 'Mousse de Maracujá', price: 5.50, imageUrl: 'https://images.unsplash.com/photo-1579306193793-0be3c9668994?auto=format&fit=crop&w=150&q=80' },
];

export const cremes: MenuItem[] = [
  { id: 'cr_ovf', name: 'Ovomaltine® Flocos', price: 5.00, isNew: true, imageUrl: 'https://images.unsplash.com/photo-1579306193793-0be3c9668994?auto=format&fit=crop&w=150&q=80' },
  { id: 'cr_ovc', name: 'Ovomaltine® Creme', price: 5.00, isNew: true, imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=150&q=80' },
  { id: 'cr_nut', name: 'Nutella', price: 8.00, isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=150&q=80' },
  { id: 'cr_lei', name: 'Leite em pó', price: 3.20, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80' },
  { id: 'cr_lco', name: 'Leite condensado', price: 3.20, imageUrl: 'https://images.unsplash.com/photo-1563824443-1b85566c7f54?auto=format&fit=crop&w=150&q=80' },
];

export const cremesEspeciais: MenuItem[] = [
  { id: 'ce_ave', name: 'Creme de Avelã', price: 5.50, imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=150&q=80' },
  { id: 'ce_nin', name: 'Creme de Ninho', price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80' },
];
