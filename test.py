def ct1():
    a = list(range(2,10,6)) #a[2,8]
    (b,c) = (a, a[:2]) # b[2,8], c[2,8]
    b[0] +=3 # b[5,8], a[5,8]
    a += [3] #a[5,8,3], b[5,8,3]
    a = a+[7] #a[5,8,3,7], b[5,8,3]
    print(c + [b[0]]) #  c [2, 8] b[0] = 5
    print(c.append(b[1])) #2,8,8
    print(a) #5,8,3,7
    print(b) #5,8,3
    return c

print(ct1()) # 2,8,8