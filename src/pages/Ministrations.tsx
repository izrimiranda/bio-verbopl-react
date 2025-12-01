import React from 'react';
import { Link } from 'react-router-dom';

interface PlatformLink {
  name: string;
  url: string;
  image: string;
}

const platforms: PlatformLink[] = [
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/show/6QB0P8qtAZvUmIhwuF04xJ',
    image: 'https://img.codigo1615.com.br/uploads/images/departamento-de-proje-o-e-sonoplastia/img_692c91f0637065.26083782.png?t=20251130'
  },
  {
    name: 'Apple Podcast',
    url: 'https://podcasts.apple.com/us/podcast/verbo-da-vida-pedro-leopoldo/id1641965433',
    image: 'https://img.codigo1615.com.br/uploads/images/departamento-de-proje-o-e-sonoplastia/img_692c91f01ab590.34788371.png?t=20251130'
  },
  {
    name: 'Amazon Music',
    url: 'https://music.amazon.com.br/podcasts/1783bbaa-bc26-42e7-a919-c766527aa727',
    image: 'https://img.codigo1615.com.br/uploads/images/departamento-de-proje-o-e-sonoplastia/img_692c91efe85a15.17474403.png?t=20251130'
  },
  {
    name: 'Castbox',
    url: 'https://castbox.fm/channel/Verbo-da-Vida-Pedro-Leopoldo-id5060713?country=br',
    image: 'https://img.codigo1615.com.br/uploads/images/departamento-de-proje-o-e-sonoplastia/img_692c91f0370ec4.13051336.png?t=20251130'
  }
];

export const Ministrations: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#383f51', color: '#ffffff' }}>
      {/* Header */}
      <header className="relative z-10 bg-primary shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="https://i.imgur.com/HGjl2U8.png" 
              alt="Igreja Verbo da Vida - Pedro Leopoldo" 
              className="h-12 w-auto"
            />
          </Link>
          <Link 
            to="/" 
            className="text-white hover:text-beige transition-colors text-sm font-medium"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm text-white">
              Ministrações
            </h1>
            <p className="text-lg max-w-2xl mx-auto font-medium text-gray-200">
              Ouça as ministrações da Igreja Verbo da Vida Pedro Leopoldo nas principais plataformas de podcast
            </p>
          </div>

          {/* Platforms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border-2 border-gray-200 hover:border-beige cursor-pointer"
              >
                <div className="w-full bg-gradient-to-br from-primary to-secondary p-0 flex items-center justify-center">
                  <img 
                    src={platform.image} 
                    alt={platform.name}
                    className="w-44 h-44 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center bg-white border-t border-gray-100">
                  <h3 className="text-sm font-bold group-hover:text-beige transition-colors" style={{ color: '#383f51' }}>
                    Ouvir no {platform.name}
                  </h3>
                  <p className="text-xs font-medium" style={{ color: '#6b7280' }}>
                    Clique para abrir
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Additional Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-beige/30">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#383f51' }}>
                Palavra que Transforma
              </h2>
              <p className="leading-relaxed font-medium" style={{ color: '#4b5563' }}>
                Acompanhe nossas ministrações semanais e seja edificado pela Palavra de Deus. 
                Escolha sua plataforma favorita e não perca nenhuma mensagem!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-primary text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            {/* Logo */}
            <img 
              src="https://i.imgur.com/HGjl2U8.png" 
              alt="Igreja Verbo da Vida - Pedro Leopoldo" 
              className="h-16 w-auto opacity-90"
            />
            
            {/* Info */}
            <div className="text-center">
              <p className="text-sm opacity-80">
                © {new Date().getFullYear()} Igreja Verbo da Vida Pedro Leopoldo
              </p>
              <p className="text-xs opacity-70 mt-1">
                Todos os direitos reservados
              </p>
            </div>
            
            {/* Tech Credit */}
            <div className="text-center border-t border-white/20 pt-4 w-full max-w-md">
              <p className="text-xs opacity-70">
                Departamento de Tecnologia
              </p>
              <p className="text-xs opacity-60 mt-1">
                Desenvolvido com ❤️
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
