import sys


class Graph():

    def __init__(self, vertices):
        self.V = vertices
        self.graph = [[0 for column in range(vertices)]
					for row in range(vertices)]

    def add_edge(self, frm, to, dist = 0):
        self.graph[frm][to] = dist
        self.graph[to][frm] = dist

    def printSolution(self, dist, path):
        print("Vertex \tDistance from Source")
        for node in range(self.V):
            print(node, "\t", dist[node], "\t", path[node])

	# A utility function to find the vertex with
	# minimum distance value, from the set of vertices
	# not yet included in shortest path tree
    def minDistance(self, dist, sptSet):

		# Initialize minimum distance for next node
        min = sys.maxsize
		# Search not nearest vertex not in the
		# shortest path tree

        for u in range(self.V):
            if dist[u] < min and sptSet[u] == False:
                min = dist[u]
                min_index = u

        return min_index

	# Function that implements Dijkstra's single source
	# shortest path algorithm for a graph represented
	# using adjacency matrix representation
    def dijkstra(self, src, trg):

        dist = [sys.maxsize] * self.V
        dist[src] = 0
        sptSet = [False] * self.V

        path = []
        # Iterate over a sequence of numbers from 0 to 4
        for i in range(self.V):
            # In each iteration, add an empty list to the main list
            path.append([src])

        for cout in range(self.V):
			# Pick the minimum distance vertex from
			# the set of vertices not yet processed.
			# x is always equal to src in first iteration
            x = self.minDistance(dist, sptSet)

			# Put the minimum distance vertex in the
			# shortest path tree
            sptSet[x] = True
			# Update dist value of the adjacent vertices
			# of the picked vertex only if the current
			# distance is greater than new distance and
			# the vertex in not in the shortest path tree
            for y in range(self.V):
                if self.graph[x][y] > 0 and sptSet[y] == False and \
						dist[y] > dist[x] + self.graph[x][y]:
                    dist[y] = dist[x] + self.graph[x][y]

                    prevStep = path[x].copy()
                    tmp = []
                    tmp.append(y)

                    prevStep.extend(tmp)
                    path[y] = prevStep

            if x == trg:
                break

        return path[trg]


# Driver's code
if __name__ == "__main__":
    edges = {
        0: {1:1.5, 25:3, 26: 4},
        1: {2:3.5, 3:5, 25:1.5, 26:7},
        3: {2:2, 4:1.5, 5:3, 7:5, 6:4},
        7: {5:2, 6:1, 3:5, 4:5.3, 8:2.5, 9:3, 10:5.5, 11:6},
        10: {8:3.5, 9:2, 11:1.5, 12:1.5, 13:6, 14:8, 15:7},
        14: {13:2, 12:2.5, 15:4, 16:6, 33:7},
        15: {13:3, 16:3, 18:1, 19:2.5, 20:3, 22:5, 23:7, 24:7, 25:8, 33:3},
        21: {17: 5, 32:4, 33:7, 34:2, 35:2, 37:4, 36:6, 38:7},
        25: {18:7, 19:5.5, 20:5, 22:3, 23:1.5, 24:1.5, 26:4},
        26: {27:3.5, 48:7},
        27: {28:2.5, 30:4.5, 31:6, 32:8, 48:4},
        32: {17:3, 28:6, 30:4.5, 31:2, 33:1.5, 34:3},
        33: {13:5, 16:1.5, 17:2, 34:5 },
        37: {35:2, 36:3, 38:3, 43:2.5, 45:4.5, 46:6, 47:8},
        38: {35:6, 36:2, 39:3.5, 40:7, 41:5, 42:2},
        47: {43:6, 45:4.5, 46:2, 48:4, 53:3, 49:4},
        48: {49:7, 53:4.5},
        49: {50:3.5, 51:7, 52:3.5, 53:2.5}
    }

    g = Graph(54)
    for k_i, v_i in edges.items():
        for k_j, v_j in v_i.items():
            g.add_edge(k_i, k_j, v_j)

    print(g.dijkstra(0, 36))


