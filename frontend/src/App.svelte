<script lang="ts">
  import './app.css';
  import { onMount } from 'svelte';

  let apiKey: string = '';
  
  interface Article {
    web_url: string;
    headline: { main: string };
    snippet: string;
  }
  
  let articles: Article[] = [];
  let query = 'election';


  onMount(async () => {
    try {
      const res = await fetch('/api/key');
      const data = await res.json();
      apiKey = data.apiKey;
    } catch (error) {
      console.error('Failed to fetch API key:', error);
    }
  });


  onMount(async () => {
    try {
      const res = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${apiKey}`
      );
      const data = await res.json();
      articles = data.response.docs; // NYT API returns articles in `response.docs`
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  });




  
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
      <h2>Results for "{query}"</h2>
      <ul>
        {#each articles as article}
          <li>
            <a href={article.web_url} target="_blank">{article.headline.main}</a>
            <p>{article.snippet}</p>
          </li>
        {/each}
      </ul>
        <div class="container">
            <div class="column">
                <div class="section">
                    <img src="/image2.png" alt="image of young kids playing basketball">
                    <h2>Excepteur sint occaecat cupidatat non proident</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <div class="section">
                    <h2>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>

            </div>
    
            <div class="column">
                <div class="section">
                    <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div class="section">
                    <img src="/image3.png" alt="iconic image of the NYC Brooklyn Bridge">
                    <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
    
            <div class="column">
                <div class="section">
                    <img src="/image1.png" alt="image of a salad with baby corn, lettuce, and boiled eggs">
                    <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <div class="section">
                    <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</h2>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        </div>
    </section>

</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
