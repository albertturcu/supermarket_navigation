import sys
import json

class Graph():
    def __init__(self, vertices=54):
        self.V = vertices
        self.graph = [[0 for column in range(vertices)]
					for row in range(vertices)]

        #  init graph with layout edges/distances
        with open('dijkstra/edges.json', 'r') as file:
            data = json.load(file)
            for k_i, v_i in data.items():
                for k_j, v_j in v_i.items():
                    self.add_edge(k_i, k_j, v_j)


    def add_edge(self, frm, to, dist = 0):
        frm = int(frm)
        to = int(to)
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
