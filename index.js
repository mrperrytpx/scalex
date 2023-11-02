const graph = {
    A: ["B", "C"],
    B: ["A", "C", "D", "E"],
    C: ["A", "B", "D", "E"],
    D: ["B", "C", "E"],
    E: ["B", "C", "D"],
};

const edges = {
    AB: "rl",
    BA: "rl",
    AC: "rr",
    CA: "rr",
    BC: "t",
    CB: "t",
    BD: "l",
    DB: "l",
    DE: "b",
    ED: "b",
    EC: "r",
    CE: "r",
    BE: "xr",
    EB: "xr",
    CD: "xl",
    DC: "xl",
};

function findAllPaths(startNode) {
    const solutions = [];

    const dfs = (node, trace, edges = new Set()) => {
        for (const neighbour of graph[node]) {
            const edge1 = `${node}->${neighbour}`;
            const edge2 = `${neighbour}->${node}`;
            if (!edges.has(edge1) && !edges.has(edge2)) {
                edges.add(edge1);
                edges.add(edge2);
                trace.push(neighbour);
                dfs(neighbour, trace, edges);
                trace.pop();
                edges.delete(edge1);
                edges.delete(edge2);
            }
        }

        solutions.push([...trace]);
    };

    dfs(startNode, [startNode]);

    return solutions.filter((x) => x.length === 9);
}

const allSides = ["rl", "rr", "t", "l", "r", "b", "xl", "xr"];

const totalSolution = document.createElement("p");

const selectElement = document.querySelector("select");
const allHousesWrapper = document.querySelector(".wrapper");

selectElement.addEventListener("change", (event) => {
    const allSolutions = findAllPaths(event.target.value);

    while (allHousesWrapper.lastElementChild) {
        allHousesWrapper.removeChild(allHousesWrapper.lastElementChild);
    }

    if (!allSolutions.length) {
        const path = document.createElement("p");
        path.classList.add("no-solutions");
        path.textContent =
            "No solutions exist from starting point " +
            event.target.value +
            ".";
        allHousesWrapper.appendChild(path);
        return;
    }

    totalSolution.textContent = `Total solutions: ${allSolutions.length}`;
    totalSolution.classList.add("total");
    selectElement.parentNode.appendChild(totalSolution);

    allSolutions.forEach((solution) => {
        const houseContainer = document.createElement("div");
        houseContainer.classList.add("house-container");

        const path = document.createElement("p");
        path.classList.add("path");
        path.textContent = solution.join("->");
        const item = document.createElement("div");
        item.classList.add("item");
        item.appendChild(houseContainer);
        item.appendChild(path);
        allHousesWrapper.appendChild(item);

        createAndDeleteLines(houseContainer, solution);
    });
});

function createAndDeleteLines(houseContainer, solution) {
    let i = 1;
    let intervalId;

    intervalId = setInterval(() => {
        if (i < solution.length) {
            const direction = solution[i - 1] + solution[i];
            const line = document.createElement("div");
            line.classList.add(edges[direction]);
            houseContainer.appendChild(line);
            i++;
        } else {
            clearInterval(intervalId);
            setTimeout(() => {
                while (houseContainer.firstChild) {
                    houseContainer.removeChild(houseContainer.firstChild);
                }
                createAndDeleteLines(houseContainer, solution);
            }, 2000);
        }
    }, 500);
}
