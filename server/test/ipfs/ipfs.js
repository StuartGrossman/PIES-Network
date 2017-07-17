var chai = require('chai')
var dirtyChai = require('dirty-chai')
var expect = chai.expect
chai.use(dirtyChai)
var bs58 = require('bs58')
var Readable = require('readable-stream')
var loadFixture = require('aegir/fixtures')
var bl = require('bl')
var isNode = require('detect-node')
var concat = require('concat-stream')
var through = require('through2')
var Buffer = require('safe-buffer').Buffer

module.exports = function(common){
  describe('.files', function(){
    var smallFile
    var bigFile
    var directoryContent
    var ipfs

    before(function(done) {
      // CI is slow
      this.timeout(20 * 1000)

      smallFile = loadFixture(__dirname, '../test/fixtures/testfile.txt', 'interface-ipfs-core')
      bigFile = loadFixture(__dirname, '../test/fixtures/15mb.random', 'interface-ipfs-core')

      directoryContent = {
        'pp.txt': loadFixture(__dirname, '../test/fixtures/test-folder/pp.txt', 'interface-ipfs-core'),
        'holmes.txt': loadFixture(__dirname, '../test/fixtures/test-folder/holmes.txt', 'interface-ipfs-core'),
        'jungle.txt': loadFixture(__dirname, '../test/fixtures/test-folder/jungle.txt', 'interface-ipfs-core'),
        'alice.txt': loadFixture(__dirname, '../test/fixtures/test-folder/alice.txt', 'interface-ipfs-core'),
        'files/hello.txt': loadFixture(__dirname, '../test/fixtures/test-folder/files/hello.txt', 'interface-ipfs-core'),
        'files/ipfs.txt': loadFixture(__dirname, '../test/fixtures/test-folder/files/ipfs.txt', 'interface-ipfs-core')
      }

      common.setup(function(err, factory){
        expect(err).to.not.exist()
        factory.spawnNode(function(err, node){
          expect(err).to.not.exist()
          ipfs = node
          done()
        })
      })
    })

    after(function(done){
      common.teardown(done)
    })

    describe('callback API', function(done){
      describe('.add', function(){
        it('stream', function(done){
          var buffered = Buffer.from('some data')
          var expectedMultihash = 'QmVv4Wz46JaZJeH5PMV4LGbRiiMKEmszPYY3g6fjGnVXBS'

          var rs = new Readable()
          rs.push(buffered)
          rs.push(null)

          var arr = []
          var filePair = {
            path: 'data.txt',
            content: rs
          }

          arr.push(filePair)

          ipfs.files.add(arr, function(err, res){
            expect(err).to.not.exist()
            expect(res).to.be.length(1)
            var file = res[0]
            expect(file).to.exist()
            expect(file.path).to.equal('data.txt')
            expect(file.size).to.equal(17)
            expect(file.hash).to.equal(expectedMultihash)
            done()
          })
        })

        it('buffer as tuple', function(done){
          var file = {
            path: 'testfile.txt',
            content: smallFile
          }
          var expectedMultihash = 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'

          ipfs.files.add([file], function(err, res){
            expect(err).to.not.exist()

            var file = res[0]
            expect(file.hash).to.equal(expectedMultihash)
            expect(file.path).to.equal('testfile.txt')
            done()
          })
        })

        it('buffer', function(done){
          var expectedMultihash = 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'

          ipfs.files.add(smallFile, function(err, res){
            expect(err).to.not.exist()
            expect(res).to.have.length(1)
            var file = res[0]
            expect(file.hash).to.equal(expectedMultihash)
            expect(file.path).to.equal(file.hash)
            done()
          })
        })

        it('BIG buffer', function(done){
          var expectedMultihash = 'Qme79tX2bViL26vNjPsF3DP1R9rMKMvnPYJiKTTKPrXJjq'

          ipfs.files.add(bigFile, function(err, res){
            expect(err).to.not.exist()
            expect(res).to.have.length(1)
            var file = res[0]
            expect(file.hash).to.equal(expectedMultihash)
            expect(file.path).to.equal(file.hash)
            done()
          })
        })

        it('add a nested dir as array', function(done){
          // Needs https://github.com/ipfs/js-ipfs-api/issues/339 to be fixed
          // for js-ipfs-api + go-ipfs
          if (!isNode) { return done() }

          var content = function(name){
            return { path: 'test-folder/' + name,
            content: directoryContent[name] }

          }

          var emptyDir = function(name){
            return {path: 'test-folder/' + name}

          }

          var expectedRootMultihash = 'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP'

          var dirs = [
            content('pp.txt'),
            content('holmes.txt'),
            content('jungle.txt'),
            content('alice.txt'),
            emptyDir('empty-folder'),
            content('files/hello.txt'),
            content('files/ipfs.txt'),
            emptyDir('files/empty')
          ]

          ipfs.files.add(dirs, function(err, res){
            expect(err).to.not.exist()
            var root = res[res.length - 1]

            expect(root.path).to.equal('test-folder')
            expect(root.hash).to.equal(expectedRootMultihash)
            done()
          })
        })

        describe('.createAddStream', function(){
          it('stream of valid files and dirs', function(done){
            var content = function(name){
              return {
              path: 'test-folder/' + name,
              content: directoryContent[name]
              }

            }

            var emptyDir = function(name){
              return {
                path: 'test-folder/' + name

              }
            }

            var expectedRootMultihash = 'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP'

            var files = [
              content('pp.txt'),
              content('holmes.txt'),
              content('jungle.txt'),
              content('alice.txt'),
              emptyDir('empty-folder'),
              content('files/hello.txt'),
              content('files/ipfs.txt'),
              emptyDir('files/empty')
            ]

            ipfs.files.createAddStream(function(err, stream){
              expect(err).to.not.exist()

              stream.on('data', function(file){
                if (file.path === 'test-folder') {
                  expect(file.hash).to.equal(expectedRootMultihash)
                  done()
                }
              })

              files.forEach(function(file){
                stream.write(file)
              })
              stream.end()
            })
          })
        })

        it('fails in invalid input', function(done){
          var nonValid = 'sfdasfasfs'

          ipfs.files.add(nonValid, function(err, result){
            expect(err).to.exist()
            done()
          })
        })
      })

      describe('.cat', function(){
        it('with a base58 string encoded multihash', function(done){
          var hash = 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'

          ipfs.files.cat(hash, function(err, stream){
            expect(err).to.not.exist()
            stream.pipe(bl(function(err, data){
              expect(err).to.not.exist()
              expect(data.toString()).to.contain('Plz add me!')
              done()
            }))
          })
        })

        it('with a multihash', function(done){
          var mhBuf = Buffer.from(bs58.decode('Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'))
          ipfs.files.cat(mhBuf, function(err, stream){
            expect(err).to.not.exist()
            stream.pipe(bl(function(err, data){
              expect(err).to.not.exist()
              expect(data.toString()).to.contain('Plz add me!')
              done()
            }))
          })
        })

        it('streams a large file', function(done){
          var hash = 'Qme79tX2bViL26vNjPsF3DP1R9rMKMvnPYJiKTTKPrXJjq'

          ipfs.files.cat(hash, function(err, stream){
            expect(err).to.not.exist()
            stream.pipe(bl(function(err, data){
              expect(err).to.not.exist()
              expect(data).to.deep.equal(bigFile)
              done()
            }))
          })
        })

        it('with ipfs path', function(done){
          var ipfsPath = '/ipfs/Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'

          ipfs.files.cat(ipfsPath, function(err, stream){
            expect(err).to.not.exist()
            stream.pipe(bl(function(err, data){
              expect(err).to.not.exist()
              expect(data.toString()).to.contain('Plz add me!')
              done()
            }))
          })
        })

        it('with ipfs path, nested value', function(done){
          var file = {
            path: 'a/testfile.txt',
            content: smallFile
          }

          ipfs.files.createAddStream(function(err, stream){
            expect(err).to.not.exist()

            stream.on('data', function(file){
              if (file.path === 'a') {
                ipfs.files.cat('/ipfs/' + file.hash + '/testfile.txt', function(err, stream){
                  expect(err).to.not.exist()
                  stream.pipe(bl(function(err, data){
                    expect(err).to.not.exist()
                    expect(data.toString()).to.contain('Plz add me!')
                    done()
                  }))
                })
              }
            })

            stream.write(file)
            stream.end()
          })
        })
      })

      describe('.get', function(){
        it('with a base58 encoded multihash', function(done){
          var hash = 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'
          ipfs.files.get(hash, function(err, stream){
            expect(err).to.not.exist()

            var files = []
            stream.pipe(through.obj(function(file, enc, next){
              file.content.pipe(concat(function(content){
                files.push({
                  path: file.path,
                  content: content
                })
                next()
              }))
            }, function(){
              expect(files).to.be.length(1)
              expect(files[0].path).to.be.eql(hash)
              expect(files[0].content.toString()).to.contain('Plz add me!')
              done()
            }))
          })
        })

        it('with a multihash', function(done){
          var hash = 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'
          var mhBuf = Buffer.from(bs58.decode(hash))
          ipfs.files.get(mhBuf, function(err, stream){
            expect(err).to.not.exist()

            var files = []
            stream.pipe(through.obj(function(file, enc, next){
              file.content.pipe(concat(function(content){
                files.push({
                  path: file.path,
                  content: content
                })
                next()
              }))
            }, function(){
              expect(files).to.be.length(1)
              expect(files[0].path).to.be.eql(hash)
              expect(files[0].content.toString()).to.contain('Plz add me!')
              done()
            }))
          })
        })

        it('large file', function(done){
          var hash = 'Qme79tX2bViL26vNjPsF3DP1R9rMKMvnPYJiKTTKPrXJjq'
          ipfs.files.get(hash, function(err, stream){
            expect(err).to.not.exist()

            // accumulate the files and their content
            var files = []
            stream.pipe(through.obj(function(file, enc, next){
              file.content.pipe(concat(function(content){
                files.push({
                  path: file.path,
                  content: content
                })
                next()
              }))
            }, function(){
              expect(files.length).to.equal(1)
              expect(files[0].path).to.equal(hash)
              expect(files[0].content).to.deep.equal(bigFile)
              done()
            }))
          })
        })

        it('directory', function(done){
          // Needs https://github.com/ipfs/js-ipfs-api/issues/339 to be fixed
          // for js-ipfs-api + go-ipfs
          if (!isNode) { return done() }

          var hash = 'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP'
          ipfs.files.get(hash, function(err, stream){
            expect(err).to.not.exist()

            // accumulate the files and their content
            var files = []
            stream.pipe(through.obj(function(file, enc, next){
              if (file.content) {
                file.content.pipe(concat(function(content){
                  files.push({
                    path: file.path,
                    content: content
                  })
                  next()
                }))
              } else {
                files.push(file)
                next()
              }
            }, function(){
              files = files.sort(function(a, b){
                if (a.path > b.path) return 1
                if (a.path < b.path) return -1
                return 0
              })
              // Check paths
              var paths = files.map(function(file){
                return file.path
              })
              expect(paths).to.include.members([
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/alice.txt',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/empty-folder',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/files',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/files/empty',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/files/hello.txt',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/files/ipfs.txt',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/holmes.txt',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/jungle.txt',
                'QmVvjDy7yF7hdnqE8Hrf4MHo5ABDtb5AbX6hWbD3Y42bXP/pp.txt'
              ])

              // Check contents
              var contents = files.map(function(file){
                return file.content ? file.content.toString() : null
              })
              expect(contents).to.include.members([
                directoryContent['alice.txt'].toString(),
                directoryContent['files/hello.txt'].toString(),
                directoryContent['files/ipfs.txt'].toString(),
                directoryContent['holmes.txt'].toString(),
                directoryContent['jungle.txt'].toString(),
                directoryContent['pp.txt'].toString()
              ])
              done()
            }))
          })
        })

        it('with ipfs path, nested value', function(done){
          var file = {
            path: 'a/testfile.txt',
            content: smallFile
          }

          ipfs.files.createAddStream(function(err, stream){
            expect(err).to.not.exist()

            stream.on('data', function(file){
              if (file.path === 'a') {
                ipfs.files.get('/ipfs/' + file.hash + '/testfile.txt', function(err, stream){
                  expect(err).to.not.exist()
                  var files = []
                  stream.pipe(through.obj(function(file, enc, next){
                    file.content.pipe(concat(function(content){
                      files.push({
                        path: file.path,
                        content: content
                      })
                      next()
                    }))
                  }, function(){
                    expect(files).to.be.length(1)
                    expect(files[0].content.toString()).to.contain('Plz add me!')
                    done()
                  }))
                })
              }
            })

            stream.write(file)
            stream.end()
          })
        })
      })
    })

    describe('promise API', function(){
      describe('.add', function(){
        var expectedMultihash = 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'

        it('buffer', function(){
          return ipfs.files.add(smallFile)
            .then(function(res){
              var file = res[0]
              expect(file.hash).to.equal(expectedMultihash)
              expect(file.path).to.equal(file.hash)
            })
        })
      })

      describe('.cat', function(){
        it('with a base58 multihash encoded string', function(){
          var hash = 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'

          return ipfs.files.cat(hash)
            .then(function(stream){
              stream.pipe(bl(function(err, data){
                expect(err).to.not.exist()
                expect(data.toString()).to.contain('Plz add me!')
              }))
            })
        })

        it('errors on invalid key', function(){
          var hash = 'somethingNotMultihash'

          return ipfs.files.cat(hash)
            .catch(function(err){
              expect(err).to.exist()
              var errString = err.toString()
              if (errString === 'Error: invalid ipfs ref path') {
                expect(err.toString()).to.contain('Error: invalid ipfs ref path')
              }
              if (errString === 'Error: Invalid Key') {
                expect(err.toString()).to.contain('Error: Invalid Key')
              }
            })
        })

        it('with a multihash', function(){
          var hash = Buffer.from(bs58.decode('Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'))
          return ipfs.files.cat(hash)
            .then(function(stream){
              stream.pipe(bl(function(err, data){
                expect(err).to.not.exist()
                expect(data.toString()).to.contain('Plz add me!')
              }))
            })
        })
      })

      describe('.get', function(){
        it('with a base58 encoded string', function(){
          var hash = 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP'
          return ipfs.files.get(hash).then(function(stream){
            var files = []
            return new Promise(function(resolve, reject){
              stream.pipe(through.obj(function(file, enc, next){
                file.content.pipe(concat(function(content){
                  files.push({
                    path: file.path,
                    content: content
                  })
                  next()
                }))
              }, function(){
                expect(files).to.be.length(1)
                expect(files[0].path).to.equal(hash)
                expect(files[0].content.toString()).to.contain('Plz add me!')
                resolve()
              }))
            })
          })
        })

        it('errors on invalid key', function(){
          var hash = 'somethingNotMultihash'
          return ipfs.files.get(hash).catch(function(err){
            expect(err).to.exist()
            var errString = err.toString()
            if (errString === 'Error: invalid ipfs ref path') {
              expect(err.toString()).to.contain('Error: invalid ipfs ref path')
            }
            if (errString === 'Error: Invalid Key') {
              expect(err.toString()).to.contain('Error: Invalid Key')
            }
          })
        })
      })
    })
  })
}
