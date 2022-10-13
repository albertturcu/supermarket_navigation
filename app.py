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
        0: {1:1.5, 25:3},
        1: {2:3.5, 3:5, 25:1.5, 26:7}
    }
    g = Graph(54)
    g.add_edge(0,1,1.5)
    g.add_edge(0,25,3)
    g.add_edge(0,26,6)

    g.add_edge(1,2,3.5)
    g.add_edge(1,3,5)
    g.add_edge(1,25,1.5)
    g.add_edge(1,26,7)

    g.add_edge(3,2,2)
    g.add_edge(3,4,1.5)
    g.add_edge(3,5,3)
    g.add_edge(3,7,5)
    g.add_edge(3,6,4)

    g.add_edge(7,5,2)
    g.add_edge(7,6,1)
    g.add_edge(7,3,5)
    g.add_edge(7,4,5.3)
    g.add_edge(7,8,2.5)
    g.add_edge(7,9,3)
    g.add_edge(7,10,5.5)
    g.add_edge(7,11,6)

    g.add_edge(10,8,3.5)
    g.add_edge(10,9,2)
    g.add_edge(10,11,1.5)
    g.add_edge(10,12,1.5)
    g.add_edge(10,13,6)
    g.add_edge(10,14,8)
    g.add_edge(10,15,7)

    g.add_edge(14,13,2)
    g.add_edge(14,12,7)
    g.add_edge(14,15,1.8)
    g.add_edge(14,16,1.5)
    g.add_edge(14,17,4)
    g.add_edge(14,33,6)
    g.add_edge(14,34,7)

    g.add_edge(15,12,7)
    g.add_edge(15,13,3)
    g.add_edge(15,18,1)
    g.add_edge(15,19,2.5)
    g.add_edge(15,20,3)
    g.add_edge(15,21,4)

    g.add_edge(21,18,3)
    g.add_edge(21,19,2)
    g.add_edge(21,20,1)
    g.add_edge(21,22,1.5)
    g.add_edge(21,23,3)
    g.add_edge(21,24,3)
    g.add_edge(21,25,4)

    g.add_edge(25,23,1.5)
    g.add_edge(25,26,6)

    g.add_edge(26,27,1.5)
    g.add_edge(26,48,7)

    g.add_edge(27,28,2.5)
    g.add_edge(27,29,4)
    g.add_edge(27,30,4.5)
    g.add_edge(27,48,6)

    g.add_edge(29,28,2.5)
    g.add_edge(29,30,1)
    g.add_edge(29,31,2.5)
    g.add_edge(29,32,4)

    g.add_edge(32,30,4.5)
    g.add_edge(32,31,2)
    g.add_edge(32,33,1.5)
    g.add_edge(32,35,5.5)
    g.add_edge(32,36,8.5)
    g.add_edge(32,38,10)

    g.add_edge(33,16,5)
    g.add_edge(33,17,2.5)
    g.add_edge(33,34,1.5)
    g.add_edge(33,35,4)
    g.add_edge(33,36,8)
    g.add_edge(33,37,6.5)

    g.add_edge(37,35,3)
    g.add_edge(37,36,3)
    g.add_edge(37,38,3)
    g.add_edge(37,43,2.5)
    g.add_edge(37,44,4)
    g.add_edge(37,45,4.5)

    g.add_edge(38,35,6)
    g.add_edge(38,36,2)
    g.add_edge(38,39,3.5)
    g.add_edge(38,40,7)
    g.add_edge(38,41,5)
    g.add_edge(38,42,2)

    g.add_edge(44,43,2.5)
    g.add_edge(44,45,1.5)
    g.add_edge(44,46,2)
    g.add_edge(44,47,4)

    g.add_edge(47,46,2)
    g.add_edge(47,45,4.5)
    g.add_edge(47,48,1.5)
    g.add_edge(47,53,3)
    g.add_edge(47,49,4)

    g.add_edge(48,26,4)
    g.add_edge(48,53,2.5)
    g.add_edge(48,49,5)

    g.add_edge(49,53,2.5)
    g.add_edge(49,50,3.5)
    g.add_edge(49,52,3.5)
    g.add_edge(49,51,7)


    print(g.dijkstra(0, 51))


