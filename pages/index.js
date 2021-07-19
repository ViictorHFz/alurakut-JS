import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/SocialCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  //console.log(propriedades);
  return(
    <Box>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px'}} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
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

export default function Home(props) {
  
  const usuarioAleatorio = props.githubUser;
  //UseState retorna um array (primeira posição os itens, segunda a função que muda o estado)
  const [comunidades, setComunidades] = React.useState([]);

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
    
    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers:{
        'Authorization': 'e0945acdc99a88102975d1aa615fd3',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }`})
    })
    .then(response => response.json())
    .then(respostaCompleta => {
      const comunidadesDatoCMS = respostaCompleta.data.allCommunities;

      setComunidades(comunidadesDatoCMS)
      
      //console.log(respostaCompleta);
    })
  }, [])



  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio}/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}> 
          <ProfileSidebar githubUser={usuarioAleatorio} />
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
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: usuarioAleatorio,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json()
                //console.log(dados.resgistroCriado)
                const comunidade = dados.resgistroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade,];
                setComunidades(comunidadesAtualizadas);
              })

              // const comunidadesAtualizadas = [...comunidades, comunidade,];
              // setComunidades(comunidadesAtualizadas);
              
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
                      <a href={`/communities/${itemAtual.id}`}>
                        <img src={itemAtual.imageUrl} />
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}