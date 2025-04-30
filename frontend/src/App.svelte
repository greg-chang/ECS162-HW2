<script lang="ts">
  import './app.css';
  import { onMount } from 'svelte';

  let apiKey: string = '';
  
  interface Article {
    web_url: string;
    headline: { main: string };
    snippet: string;
    multimedia: {
      caption: string;
      credit: string;
      default: {
        url: string;
        height: number;
        width: number;
      };
      thumbnail: {
        url: string;
        height: number;
        width: number;
      };
    };
  }
  
  let articles: Article[] = [];
  let query = 'Sacramento';

  // Fetch API key and articles sequentially
  onMount(async () => {
    try {
      // Fetch the API key
      const keyRes = await fetch('/api/key');
      const keyData = await keyRes.json();
      apiKey = keyData.apiKey;

      // Fetch articles only after the API key is loaded
      const articlesRes = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${apiKey}`
      );
      const articlesData = await articlesRes.json();
      articles = articlesData.response.docs; // NYT API returns articles in `response.docs`
      console.log(articles);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  });

  // Helper function to get the image URL from an article's multimedia
  function getArticleImage(article: Article): string {
    if (article.multimedia && article.multimedia.default) {
      return article.multimedia.default.url;
    }
    return '/image1.png'; // Fallback image
  }
</script>

<main>
    <header>
        <div class="header-container">
            <div class="date-display">
                <span id="current-date"></span>
                <p>Today's Paper</p>
            </div>
            <div class="nyt-logo">
                <img src="/nyt-logo.png" alt="New York Times Logo">
            </div>
        </div>
        <hr>
        <p>API Key: {apiKey}</p>
    </header>

    <section>
      <!-- <h2>Results for "{query}"</h2>
      <ul>
        {#each articles as article}
          <li>
            <a href={article.web_url} target="_blank">{article.headline.main}</a>
            <p>{article.snippet}</p>
          </li>
        {/each}
      </ul> -->
        <div class="container">
            <div class="column">
                <div class="section">
                    {#if articles.length > 1}
                        <img src={getArticleImage(articles[1])} alt={articles[1].headline.main}>
                        <h2>{articles[1].headline.main}</h2>
                        <p>{articles[1].snippet}</p>
                    {:else}
                        <img src="/image2.png" alt="Loading...">
                        <h2>Loading articles...</h2>
                        <p>Please wait while we fetch the latest news.</p>
                    {/if}
                </div>
                <div class="section">
                    {#if articles.length > 2}
                        <img src={getArticleImage(articles[2])} alt={articles[2].headline.main}>
                        <h2>{articles[2].headline.main}</h2>
                        <p>{articles[2].snippet}</p>
                    {:else}
                        <img src="/image2.png" alt="Loading...">
                        <h2>Loading articles...</h2>
                        <p>Please wait while we fetch the latest news.</p>
                    {/if}
                </div>
            </div>

            <div class="column">
                <div class="section">
                    {#if articles.length > 0}
                        <img src={getArticleImage(articles[0])} alt={articles[0].headline.main}>
                        <h1>{articles[0].headline.main}</h1>
                        <p>{articles[0].snippet}</p>
                    {:else}
                        <img src="/image2.png" alt="Loading...">
                        <h1>Loading articles...</h1>
                        <p>Please wait while we fetch the latest news.</p>
                    {/if}
                </div>
                <div class="section">
                    {#if articles.length > 3}
                        <img src={getArticleImage(articles[3])} alt={articles[3].headline.main}>
                        <h2>{articles[3].headline.main}</h2>
                        <p>{articles[3].snippet}</p>
                    {:else}
                        <img src="/image3.png" alt="Loading...">
                        <h2>Loading articles...</h2>
                        <p>Please wait while we fetch the latest news.</p>
                    {/if}
                </div>
            </div>

            <div class="column">
                <div class="section">
                    {#if articles.length > 4}
                        <img src={getArticleImage(articles[4])} alt={articles[4].headline.main}>
                        <h2>{articles[4].headline.main}</h2>
                        <p>{articles[4].snippet}</p>
                    {:else}
                        <img src="/image1.png" alt="Loading...">
                        <h2>Loading articles...</h2>
                        <p>Please wait while we fetch the latest news.</p>
                    {/if}
                </div>
                <div class="section">
                    {#if articles.length > 5}
                        <img src={getArticleImage(articles[5])} alt={articles[5].headline.main}>
                        <h2>{articles[5].headline.main}</h2>
                        <p>{articles[5].snippet}</p>
                    {:else}
                        <img src="/image1.png" alt="Loading...">
                        <h2>Loading articles...</h2>
                        <p>Please wait while we fetch the latest news.</p>
                    {/if}
                </div>
            </div>
        </div>
    </section>
</main>

<style>
</style>
