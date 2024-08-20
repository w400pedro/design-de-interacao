async function fetchFeriados() {
    try {
        const response = await fetch('https://brasilapi.com.br/api/feriados/v1/2024');
        if (!response.ok) throw new Error('Erro ao buscar os feriados.');
        const feriados = await response.json();
        document.getElementById('feriados').innerHTML = feriados.map(f => `<p>${f.date}: ${f.name}</p>`).join('');
    } catch (error) {
        document.getElementById('feriados').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function fetchCrypto() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
        if (!response.ok) throw new Error('Erro ao buscar as informações da criptomoeda.');
        const cryptoInfo = await response.json();
        document.getElementById('crypto').innerHTML = `
            <p>Nome: ${cryptoInfo.name}</p>
            <p>Símbolo: ${cryptoInfo.symbol.toUpperCase()}</p>
            <p>Preço Atual: $${cryptoInfo.market_data.current_price.usd.toFixed(2)}</p>
            <p>Ranking de Mercado: ${cryptoInfo.market_cap_rank}</p>
            <p>Site Oficial: <a href="${cryptoInfo.links.homepage[0]}" target="_blank">${cryptoInfo.links.homepage[0]}</a></p>
            `
    } catch (error) {
        document.getElementById('dollar').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

document.getElementById('cepForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const cep = document.getElementById('cepInput').value;
    try {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
        if (!response.ok) throw new Error('Nenhum CEP existente.');
        const data = await response.json();
        document.getElementById('cepResult').innerHTML = `<p>${data.street}, ${data.neighborhood}, ${data.city} - ${data.state}</p>`;
    } catch (error) {
        document.getElementById('cepResult').innerHTML = `<p class="error">${error.message}</p>`;
    }
});

document.getElementById('bancoForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const codigo = document.getElementById('bancoInput').value;
    try {
        const response = await fetch(`https://brasilapi.com.br/api/banks/v1/${codigo}`);
        if (!response.ok) throw new Error('Nenhum banco encontrado.');
        const data = await response.json();
        document.getElementById('bancoResult').innerHTML = `<p>${data.fullName} - Código: ${data.code}</p>`;
    } catch (error) {
        document.getElementById('bancoResult').innerHTML = `<p class="error">${error.message}</p>`;
    }
});

async function fetchWithRace() {
    const apis = [
        fetch('https://jsonplaceholder.typicode.com/posts/1'),
        fetch('https://jsonplaceholder.typicode.com/posts/2'),
        fetch('https://jsonplaceholder.typicode.com/posts/3')
    ];

    try {
        const response = await Promise.race(apis);
        if (!response.ok) throw new Error('Erro na consulta.');
        const data = await response.json();
        document.getElementById('raceResult').innerHTML = `<p>Resultado: ${data.title}</p>`;
    } catch (error) {
        document.getElementById('raceResult').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function fetchWithAll() {
    const apis = [
        fetch('https://jsonplaceholder.typicode.com/posts/1'),
        fetch('https://jsonplaceholder.typicode.com/posts/2'),
        fetch('https://jsonplaceholder.typicode.com/posts/3')
    ];

    try {
        const responses = await Promise.all(apis);
        const data = await Promise.all(responses.map(response => {
            if (!response.ok) throw new Error('Erro na consulta.');
            return response.json();
        }));
        document.getElementById('allResult').innerHTML = data.map(d => `<p>${d.title}</p>`).join('');
    } catch (error) {
        document.getElementById('allResult').innerHTML = `<p class="error">${error.message}</p>`;
    }
}