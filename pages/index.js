import { useState } from 'react';
import Head from 'next/head';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Notifications, { notify } from 'react-notify-toast';
import { useHotkeys } from 'react-hotkeys-hook';

const Home = () => {
	const [urlList, setUrlsList] = useState('');
	const [urlLog, setUrlLog] = useState('');

	const [linkFilter, setLinkFilter] = useState('');
	const [openCount, setOpenCount] = useState(10);

	useHotkeys('ctrl+r', () => openAllUrls(null));

	const linkExtractor = text => {
		if (text) {
			var urlRegex = /(https?:\/\/[^\s]+)/g;
			let linkInText = '';
			text.replace(urlRegex, function(url) {
				linkInText = linkInText + '\n' + url;
				return url;
			});
			return linkInText.trim();
		}
	};

	const onlyUnique = (value, index, self) => {
		return self.indexOf(value) === index;
	};

	const extrackLinks = () => {
		const output = linkExtractor(urlList);
		setUrlsList(output);
		notify.show('Links Extracted', 'success');
	};

	const applyFilters = () => {
		if (linkFilter) {
			extrackLinks();
			const output = urlList.split('\n').filter(dt => dt.includes(linkFilter));
			const result = output.splice(',').join('\n');
			setUrlsList(result);
			notify.show('Filtered Results', 'success');
		}
	};

	const makeLinksUnique = () => {
		const uniqueLinks = urlList
			.split('\n')
			.filter(onlyUnique)
			.splice(',')
			.join('\n');
		setUrlsList(uniqueLinks);
		notify.show('Sorted By Unique Links', 'success');
	};

	const openAllUrls = e => {
		if (e) e.preventDefault();
		if (!urlList) notify.show("No Valid URL's entered", 'error');
		else {
			extrackLinks();
			let urlOpened = 0;
			const urlVisited = [];
			const urlListArray = urlList.split('\n');

			urlListArray.map(url => {
				if (openCount > urlOpened) {
					urlOpened++;
					urlVisited.push(url);
					window.open(linkExtractor(url));
				}
			});

			const newUrlList = urlListArray
				.splice(openCount, urlListArray.length)
				.splice(',')
				.join('\n');
			setUrlsList(newUrlList);

			const urlLogExisting = urlLog.split('\n');
			const logData = [...urlVisited, ...urlLogExisting].splice(',').join('\n');

			setUrlLog(logData);
		}
	};

	return (
		<div className="container">
			<Head>
				<title>URL Opener</title>
				<link rel="icon" href="/favicon.ico" />
				<link href="https://fonts.googleapis.com/css?family=Quicksand&display=swap" rel="stylesheet" />
			</Head>

			<main>
				<Notifications />

				<header>
					<div>
						<h1 className="title">URL Opener</h1>
						<p className="description">Extract link / filter links from text and open URL's</p>
					</div>
					<div className="social">
						Follow on{' '}
						<a target="_BLANK" href="https://twitter.com/PJijin">
							Twitter
						</a>
						<a target="_BLANK" href="https://github.com/PJijin/URL-Opener">
							Github
						</a>
					</div>
				</header>

				<div className="content-area">
					<textarea
						className="linksEditor"
						onChange={e => setUrlsList(e.target.value)}
						placeholder="Paste Text / Links"
						value={urlList}
					></textarea>
					<div className="f-sb">
						<div className="options">
							<input
								type="text"
								onChange={e => setLinkFilter(e.target.value)}
								value={linkFilter}
								placeholder="Filter Links"
								onBlur={applyFilters}
							/>

							<input
								type="number"
								onChange={e => setOpenCount(e.target.value)}
								value={openCount}
								placeholder="Limit URL"
							/>
							<span onClick={extrackLinks}>Extrack Links</span>
							<span onClick={makeLinksUnique}>Unique Links</span>
							<CopyToClipboard text={urlList} onCopy={() => notify.show('Copied!', 'success')}>
								<span>Copy Links</span>
							</CopyToClipboard>
							<CopyToClipboard text={urlLog} onCopy={() => notify.show('Copied!', 'success')}>
								<span>Copy Logs</span>
							</CopyToClipboard>
							<span
								onClick={() => {
									setUrlsList('');
									setUrlLog('');
								}}
							>
								Clear Links
							</span>
						</div>
						<button onClick={openAllUrls}>
							Open URL's <span className="shortcut">(Ctrl + R)</span>
						</button>
					</div>
					<textarea
						className="logEditor"
						placeholder="URL Log"
						onChange={e => setUrlLog(e.target.value)}
						value={urlLog}
					></textarea>
				</div>
			</main>
			<style jsx global>{`
				::selection {
					background: #ff4081;
					color: #fff;
				}

				body {
					background: #000;
					color: #fff;
					padding: 1rem;
					font-family: 'Quicksand';
				}

				header {
					display: flex;
					justift-content: space-between;
				}
				header div {
					flex: 1 1 45rem;
				}

				.description {
					color: #737373;
				}
				.f-sb {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
				}

				.options {
					font-size: 12px;
				}
				.options input {
					margin-right: 10px;
				}

				.shortcut {
					font-size: 10px;
					color: #b0b7d0;
				}
				.options span {
					margin: 0 10px;
					cursor: pointer;
					color: #737373;
				}
				.options span:hover {
					color: #fff;
				}

				.social {
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}
				.social a {
					color: #737373;
					padding: 0 0.4rem;
					text-decoration: none;
				}

				.container {
					background: #000;
				}

				h1 {
					font-size: 1.5rem;
					color: #fff;
				}

				input {
					background: #333;
					border: 0px;
					font-size: 14px;
					color: #fff;
					padding: 0.5rem;
					border-radius: 0.4rem;
				}
				.linksEditor {
					width: 100%;
					height: 50vh;
					background: #333;
					border: 0px;
					font-size: 14px;
					color: #fff;
					padding: 0.5rem;
					border-radius: 0.4rem;
					line-height: 1.2rem;
				}
				.logEditor {
					width: 100%;
					height: 13vh;
					background: #333;
					border: 0px;
					font-size: 14px;
					margin-top: 1rem;
					color: #ccc;
					padding: 0.5rem;
					border-radius: 0.4rem;
					line-height: 1.2rem;
				}

				textarea:focus,
				input:focus {
					outline: none !important;
					border: 1px solid #008000;
					box-shadow: 0 0 10px #008000;
				}

				.content-area {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
				}

				button {
					border: 1px double #008000;
					margin-top: 1rem;
					color: #fff;
					background: #465692;
					padding: 1rem 2rem;
					border: thick double #000;
					border-radius: 0.4rem;
					font-weight: 500;
					cursor: pointer;
				}

				button:hover {
					background: #fff;
					color: #000;
				}
			`}</style>
		</div>
	);
};

export default Home;
