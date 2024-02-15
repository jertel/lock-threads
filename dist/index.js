/******/ var __webpack_modules__ = ({

/***/ 4:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 995:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 767:
/***/ ((module) => {

module.exports = eval("require")("@octokit/plugin-retry");


/***/ }),

/***/ 76:
/***/ ((module) => {

module.exports = eval("require")("@octokit/plugin-throttling");


/***/ }),

/***/ 378:
/***/ ((module) => {

module.exports = eval("require")("joi");


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ../../sos/apps/node-v18.18.0-linux-x64/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/core
var core = __nccwpck_require__(4);
// EXTERNAL MODULE: ../../sos/apps/node-v18.18.0-linux-x64/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/github
var github = __nccwpck_require__(995);
// EXTERNAL MODULE: ../../sos/apps/node-v18.18.0-linux-x64/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@octokit/plugin-retry
var plugin_retry = __nccwpck_require__(767);
// EXTERNAL MODULE: ../../sos/apps/node-v18.18.0-linux-x64/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@octokit/plugin-throttling
var plugin_throttling = __nccwpck_require__(76);
// EXTERNAL MODULE: ../../sos/apps/node-v18.18.0-linux-x64/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?joi
var _notfoundjoi = __nccwpck_require__(378);
;// CONCATENATED MODULE: ./src/schema.js


const extendedJoi = _notfoundjoi.extend(joi => {
  return {
    type: 'stringList',
    base: joi.array(),
    coerce: {
      from: 'string',
      method(value, helpers) {
        value = value.trim();
        if (value) {
          value = value
            .split(',')
            .map(item =>
              // remove quotes around list item
              item.replace(/^\s*["'](.+)["']\s*$/, '$1').trim()
            )
            .filter(Boolean);
        }

        return {value};
      }
    }
  };
})
  .extend(joi => {
    return {
      type: 'timeInterval',
      base: joi.array(),
      messages: {
        'timeInterval.asc':
          '{{#label}} the start date must be earlier than the end date'
      },
      coerce: {
        from: 'string',
        method(value, helpers) {
          value = value.trim();
          if (value) {
            value = value
              .split('/')
              .map(item => item.trim())
              .filter(Boolean);
          }

          return {value};
        }
      },
      rules: {
        asc: {
          validate(value, helpers, args, options) {
            if (value[0] < value[1]) {
              return value;
            }

            return helpers.error('timeInterval.asc');
          }
        }
      }
    };
  })
  .extend(joi => {
    return {
      type: 'processOnly',
      base: joi.array(),
      coerce: {
        from: 'string',
        method(value) {
          value = value.trim();

          if (value) {
            value = value
              .split(',')
              .map(item => {
                item = item.trim();
                if (['issues', 'prs', 'discussions'].includes(item)) {
                  item = item.slice(0, -1);
                }
                return item;
              })
              .filter(Boolean);
          }

          return {value};
        }
      }
    };
  });

const joiDate = _notfoundjoi.alternatives().try(
  _notfoundjoi.date().iso().min('1970-01-01T00:00:00Z').max('2970-12-31T23:59:59Z'),
  _notfoundjoi.string().trim().valid('')
);

const joiTimeInterval = _notfoundjoi.alternatives().try(
  extendedJoi
    .timeInterval()
    .items(
      _notfoundjoi.date().iso().min('1970-01-01T00:00:00Z').max('2970-12-31T23:59:59Z')
    )
    .length(2)
    .asc(),
  _notfoundjoi.string().trim().valid('')
);

const joiLabels = _notfoundjoi.alternatives().try(
  extendedJoi
    .stringList()
    .items(_notfoundjoi.string().trim().max(50))
    .min(1)
    .max(30)
    .unique(),
  _notfoundjoi.string().trim().valid('')
);

const schema = _notfoundjoi.object({
  'github-token': _notfoundjoi.string().trim().max(100),

  'issue-inactive-days': _notfoundjoi.number()
    .min(0)
    .max(3650)
    .precision(9)
    .default(365),

  'exclude-issue-created-before': joiDate.default(''),

  'exclude-issue-created-after': joiDate.default(''),

  'exclude-issue-created-between': joiTimeInterval.default(''),

  'exclude-issue-closed-before': joiDate.default(''),

  'exclude-issue-closed-after': joiDate.default(''),

  'exclude-issue-closed-between': joiTimeInterval.default(''),

  'include-any-issue-labels': joiLabels.default(''),

  'include-all-issue-labels': joiLabels.default(''),

  'exclude-any-issue-labels': joiLabels.default(''),

  'add-issue-labels': joiLabels.default(''),

  'remove-issue-labels': joiLabels.default(''),

  'issue-comment': _notfoundjoi.string().trim().max(10000).allow('').default(''),

  'issue-lock-reason': _notfoundjoi.string()
    .valid('resolved', 'off-topic', 'too heated', 'spam', '')
    .default('resolved'),

  'pr-inactive-days': _notfoundjoi.number().min(0).max(3650).precision(9).default(365),

  'exclude-pr-created-before': joiDate.default(''),

  'exclude-pr-created-after': joiDate.default(''),

  'exclude-pr-created-between': joiTimeInterval.default(''),

  'exclude-pr-closed-before': joiDate.default(''),

  'exclude-pr-closed-after': joiDate.default(''),

  'exclude-pr-closed-between': joiTimeInterval.default(''),

  'include-any-pr-labels': joiLabels.default(''),

  'include-all-pr-labels': joiLabels.default(''),

  'exclude-any-pr-labels': joiLabels.default(''),

  'add-pr-labels': joiLabels.default(''),

  'remove-pr-labels': joiLabels.default(''),

  'pr-comment': _notfoundjoi.string().trim().max(10000).allow('').default(''),

  'pr-lock-reason': _notfoundjoi.string()
    .valid('resolved', 'off-topic', 'too heated', 'spam', '')
    .default('resolved'),

  'discussion-inactive-days': _notfoundjoi.number()
    .min(0)
    .max(3650)
    .precision(9)
    .default(365),

  'exclude-discussion-created-before': joiDate.default(''),

  'exclude-discussion-created-after': joiDate.default(''),

  'exclude-discussion-created-between': joiTimeInterval.default(''),

  'exclude-discussion-closed-before': joiDate.default(''),

  'exclude-discussion-closed-after': joiDate.default(''),

  'exclude-discussion-closed-between': joiTimeInterval.default(''),

  'include-any-discussion-labels': joiLabels.default(''),

  'include-all-discussion-labels': joiLabels.default(''),

  'exclude-any-discussion-labels': joiLabels.default(''),

  'add-discussion-labels': joiLabels.default(''),

  'remove-discussion-labels': joiLabels.default(''),

  'discussion-comment': _notfoundjoi.string().trim().max(10000).allow('').default(''),

  'process-only': _notfoundjoi.alternatives()
    .try(
      extendedJoi
        .processOnly()
        .items(_notfoundjoi.string().valid('issue', 'pr', 'discussion'))
        .min(1)
        .max(3)
        .unique(),
      _notfoundjoi.string().trim().valid('')
    )
    .default(''),

  'log-output': _notfoundjoi.boolean().default(false)
});



;// CONCATENATED MODULE: ./src/utils.js







function getConfig() {
  const input = Object.fromEntries(
    Object.keys(schema.describe().keys).map(item => [item, core.getInput(item)])
  );

  const {error, value} = schema.validate(input, {abortEarly: false});
  if (error) {
    throw error;
  }

  return value;
}

function getClient(token) {
  const requestRetries = 3;

  const rateLimitCallback = function (
    retryAfter,
    options,
    octokit,
    retryCount
  ) {
    core.info(
      `Request quota exhausted for request ${options.method} ${options.url}`
    );

    if (retryCount < requestRetries) {
      core.info(`Retrying after ${retryAfter} seconds`);

      return true;
    }
  };

  const options = {
    request: {retries: requestRetries},
    throttle: {
      onSecondaryRateLimit: rateLimitCallback,
      onRateLimit: rateLimitCallback
    }
  };

  return github.getOctokit(token, options, plugin_retry.retry, plugin_throttling.throttling);
}



;// CONCATENATED MODULE: ./src/data.js
const addDiscussionCommentQuery = `
mutation ($discussionId: ID!, $body: String!) {
  addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
    comment {
      id
    }
  }
}
`;

const getLabelQuery = `
query ($owner: String!, $repo: String!, $label: String!) {
  repository(owner: $owner, name: $repo) {
    label(name: $label) {
      id
      name
    }
  }
}
`;

const createLabelQuery = `
mutation ($repositoryId: ID!, $name: String!, $color: String!) {
  createLabel(input: {repositoryId: $repositoryId, name: $name, , color: $color}) {
    label {
      id
      name
    }
  }
}
`;

const getDiscussionLabelsQuery = `
query ($owner: String!, $repo: String!, $discussion: Int!) {
  repository(owner: $owner, name: $repo) {
    discussion(number: $discussion) {
      number
      labels(first: 100) {
        nodes {
          id
          name
        }
      }
    }
  }
}
`;

const addLabelsToLabelableQuery = `
mutation ($labelableId: ID!, $labelIds: [ID!]!) {
  addLabelsToLabelable(input: {labelableId: $labelableId, labelIds: $labelIds}) {
    labelable {
      labels(first: 0) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
}
`;

const removeLabelsFromLabelableQuery = `
mutation ($labelableId: ID!, $labelIds: [ID!]!) {
  removeLabelsFromLabelable(input: {labelableId: $labelableId, labelIds: $labelIds}) {
    labelable {
      labels(first: 0) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
}
`;

const lockLockableQuery = `
mutation ($lockableId: ID!) {
  lockLockable(input: {lockableId: $lockableId}) {
    lockedRecord {
      locked
    }
  }
}
`;

const searchDiscussionsQuery = `
query ($q: String!) {
  search(type: DISCUSSION, first: 50, query: $q) {
    nodes {
      ... on Discussion {
        id
        number
      }
    }
  }
}
`;



;// CONCATENATED MODULE: ./src/index.js






async function run() {
  try {
    const config = getConfig();
    const client = getClient(config['github-token']);

    const app = new App(config, client);
    await app.lockThreads();
  } catch (err) {
    core.setFailed(err.message);
  }
}

class App {
  constructor(config, client) {
    this.config = config;
    this.client = client;
  }

  async lockThreads() {
    const processOnly = this.config['process-only'];
    const logOutput = this.config['log-output'];

    const threadTypes = processOnly || ['issue', 'pr', 'discussion'];
    for (const item of threadTypes) {
      const threads = await this.lock(item);

      core.debug(`Setting output (${item}s)`);
      if (threads.length) {
        core.setOutput(`${item}s`, JSON.stringify(threads));

        if (logOutput) {
          core.info(`Output (${item}s):`);
          core.info(JSON.stringify(threads, null, 2));
        }
      } else {
        core.setOutput(`${item}s`, '');
      }
    }
  }

  async lock(threadType) {
    const {owner, repo} = github.context.repo;

    const addLabels = this.config[`add-${threadType}-labels`];
    const removeLabels = this.config[`remove-${threadType}-labels`];
    const comment = this.config[`${threadType}-comment`];
    const lockReason = this.config[`${threadType}-lock-reason`];

    const threads = [];

    const results = await this.search(threadType);

    for (const result of results) {
      const thread =
        threadType === 'discussion'
          ? {owner, repo, discussion_number: result.number}
          : {owner, repo, issue_number: result.number};
      const threadNumber = thread.discussion_number || thread.issue_number;
      const discussionId = result.id;

      if (comment) {
        core.debug(`Commenting (${threadType}: ${threadNumber})`);

        if (threadType === 'discussion') {
          await this.client.graphql(addDiscussionCommentQuery, {
            discussionId,
            body: comment
          });
        } else {
          try {
            await this.client.rest.issues.createComment({
              ...thread,
              body: comment
            });
          } catch (err) {
            if (!/cannot be modified.*discussion/i.test(err.message)) {
              throw err;
            }
          }
        }
      }

      if (addLabels || removeLabels) {
        let currentLabels;
        if (threadType === 'discussion') {
          ({
            repository: {
              discussion: {
                labels: {nodes: currentLabels}
              }
            }
          } = await this.client.graphql(getDiscussionLabelsQuery, {
            owner,
            repo,
            discussion: thread.discussion_number
          }));
        } else {
          ({
            data: {labels: currentLabels}
          } = await this.client.rest.issues.get({...thread}));
        }

        if (addLabels) {
          const currentLabelNames = currentLabels.map(label => label.name);
          const newLabels = addLabels.filter(
            label => !currentLabelNames.includes(label)
          );

          if (newLabels.length) {
            core.debug(`Labeling (${threadType}: ${threadNumber})`);

            if (threadType === 'discussion') {
              const labels = [];
              for (const labelName of newLabels) {
                let {
                  repository: {label}
                } = await this.client.graphql(getLabelQuery, {
                  owner,
                  repo,
                  label: labelName
                });

                if (!label) {
                  ({
                    createLabel: {label}
                  } = await this.client.graphql(createLabelQuery, {
                    repositoryId: github.context.payload.repository.node_id,
                    name: labelName,
                    color: 'ffffff',
                    headers: {
                      Accept: 'application/vnd.github.bane-preview+json'
                    }
                  }));
                }

                labels.push(label);
              }

              await this.client.graphql(addLabelsToLabelableQuery, {
                labelableId: discussionId,
                labelIds: labels.map(label => label.id)
              });
            } else {
              await this.client.rest.issues.addLabels({
                ...thread,
                labels: newLabels
              });
            }
          }
        }

        if (removeLabels) {
          const matchingLabels = currentLabels.filter(label =>
            removeLabels.includes(label.name)
          );

          if (matchingLabels.length) {
            core.debug(`Unlabeling (${threadType}: ${threadNumber})`);

            if (threadType === 'discussion') {
              await this.client.graphql(removeLabelsFromLabelableQuery, {
                labelableId: discussionId,
                labelIds: matchingLabels.map(label => label.id)
              });
            } else {
              for (const label of matchingLabels) {
                await this.client.rest.issues.removeLabel({
                  ...thread,
                  name: label.name
                });
              }
            }
          }
        }
      }

      core.debug(`Locking (${threadType}: ${threadNumber})`);

      if (threadType === 'discussion') {
        await this.client.graphql(lockLockableQuery, {
          lockableId: discussionId
        });
      } else {
        const params = {...thread};

        if (lockReason) {
          params.lock_reason = lockReason;
        }

        await this.client.rest.issues.lock(params);
      }

      threads.push(thread);
    }

    return threads;
  }

  async search(threadType) {
    const {owner, repo} = github.context.repo;
    const updatedTime = this.getUpdatedTimestamp(
      this.config[`${threadType}-inactive-days`]
    );
    let query = `repo:${owner}/${repo} updated:<${updatedTime} is:closed is:unlocked`;

    const includeAnyLabels = this.config[`include-any-${threadType}-labels`];
    const includeAllLabels = this.config[`include-all-${threadType}-labels`];

    if (includeAllLabels) {
      query += ` ${includeAllLabels
        .map(label => `label:"${label}"`)
        .join(' ')}`;
    } else if (includeAnyLabels) {
      query += ` label:${includeAnyLabels
        .map(label => `"${label}"`)
        .join(',')}`;
    }

    const excludeAnyLabels = this.config[`exclude-any-${threadType}-labels`];
    if (excludeAnyLabels) {
      query += ` -label:${excludeAnyLabels
        .map(label => `"${label}"`)
        .join(',')}`;
    }

    const excludeCreatedQuery = this.getFilterByDateQuery({
      threadType,
      qualifier: 'created'
    });
    if (excludeCreatedQuery) {
      query += ` ${excludeCreatedQuery}`;
    }

    const excludeClosedQuery = this.getFilterByDateQuery({
      threadType,
      qualifier: 'closed'
    });
    if (excludeClosedQuery) {
      query += ` ${excludeClosedQuery}`;
    }

    if (threadType === 'issue') {
      query += ' is:issue';
    } else if (threadType === 'pr') {
      query += ' is:pr';
    }

    core.debug(`Searching (${threadType}s)`);

    let results;
    if (threadType === 'discussion') {
      ({
        search: {nodes: results}
      } = await this.client.graphql(searchDiscussionsQuery, {q: query}));
    } else {
      ({
        data: {items: results}
      } = await this.client.rest.search.issuesAndPullRequests({
        q: query,
        sort: 'updated',
        order: 'desc',
        per_page: 50
      }));

      // results may include locked threads
      results = results.filter(item => !item.locked);
    }

    return results;
  }

  getFilterByDateQuery({threadType, qualifier = 'created'} = {}) {
    const beforeDate = this.config[`exclude-${threadType}-${qualifier}-before`];
    const afterDate = this.config[`exclude-${threadType}-${qualifier}-after`];
    const betweenDates =
      this.config[`exclude-${threadType}-${qualifier}-between`];

    if (betweenDates) {
      return `-${qualifier}:${betweenDates
        .map(date => this.getISOTimestamp(date))
        .join('..')}`;
    } else if (beforeDate && afterDate) {
      return `${qualifier}:${this.getISOTimestamp(
        beforeDate
      )}..${this.getISOTimestamp(afterDate)}`;
    } else if (beforeDate) {
      return `${qualifier}:>${this.getISOTimestamp(beforeDate)}`;
    } else if (afterDate) {
      return `${qualifier}:<${this.getISOTimestamp(afterDate)}`;
    }
  }

  getUpdatedTimestamp(days) {
    const ttl = days * 24 * 60 * 60 * 1000;
    const date = new Date(new Date() - ttl);
    return this.getISOTimestamp(date);
  }

  getISOTimestamp(date) {
    return date.toISOString().split('.')[0] + 'Z';
  }
}

run();

})();

