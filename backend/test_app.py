import os
import pytest
from app import app

@pytest.fixture
def client():
    # Set up test environment variables
    os.environ['NYT_API_KEY'] = 'test_api_key'
    os.environ['STATIC_PATH'] = '../frontend/dist'  # Point to the Svelte build output
    os.environ['TEMPLATE_PATH'] = '../frontend/dist'  # Point to the Svelte build output
    
    app.config['TESTING'] = True
    with app.test_client() as client:
        # Create test directories
        os.makedirs('../frontend/dist', exist_ok=True)
        
        # Create a test static file
        with open('../frontend/dist/test.txt', 'w') as f:
            f.write('test content')
            
        # Create a test index.html
        with open('../frontend/dist/index.html', 'w') as f:
            f.write('<html><body>Test Index</body></html>')
            
        yield client
        
        # Cleanup after tests
        import shutil
        shutil.rmtree('../frontend/dist', ignore_errors=True)

def test_get_key(client):
    """Test that the API key endpoint returns the correct key"""
    response = client.get('/api/key')
    assert response.status_code == 200
    assert response.json['apiKey'] == 'test_api_key'

