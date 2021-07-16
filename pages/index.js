import React from 'react'
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/SocialCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  //console.log(propriedades);
  return(
    <Box>
      <img src={`https://github.com/${propriedades.gitHubUser}.png`} style={{ borderRadius: '8px'}} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.gitHubUser}`}>
          @{propriedades.gitHubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      
      <ul>
          {/*seguidores.map((itemAtual) => {
            return (
              <li key={itemAtual}>
                <a href={`/user/${itemAtual}`}>
                  <img src={itemAtual} />
                  <span>{itemAtual}</span>
                </a>
              </li>
            )
          })*/}
        </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  
  const gitHubUser = 'ViictorHFz';
  //UseState retorna um array (primeira posição os itens, segunda a função que muda o estado)
  const [comunidades, setComunidades] = React.useState([{
    id: '',
    title: 'Eu odeio acordar cedo!',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ];

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function() {
    fetch('https://api.github.com/users/ViictorHFz/followers')
    .then(function(respostaServidor) {
      return respostaServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
    })
  }, [])



  return (
    <>
      <AlurakutMenu githubUser={gitHubUser}/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}> 
          <ProfileSidebar gitHubUser={gitHubUser} />
        </div>
  
        <div className="feedArea" style={{ gridArea: 'feedArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>
            
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(event) {
              event.preventDefault();

              const dadosDoForm = new FormData(event.target);

              const comunidade = {
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image')
              }

              const comunidadesAtualizadas = [...comunidades, comunidade,];
              setComunidades(comunidadesAtualizadas);
              
            }}>
              <div>
                <input 
                  placeholder="Qual  vai ser o nome  da sua comunidade?"
                  name="title"
                  aria-label="Qual  vai ser o nome  da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type=""
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>

        </div>
        
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="seguidores" items={seguidores}/>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            
            <ul>
                {comunidades.map((itemAtual) => {
                  return (
                    <li key={itemAtual.id}>
                      <a href={`/user/${itemAtual.title}`}>
                        <img src={itemAtual.image} />
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/user/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}